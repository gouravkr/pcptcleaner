<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="16" :sm="18" :md="18" :lg="18" :xl="21">
        <el-input
          class="m16"
          style="width: 100%"
          type="textarea"
          rows="6"
          v-model="rowData"
          @input="prepareTable"
          placeholder="Paste markup copied from pcpricetracker"
        />
      </el-col>
      <el-col :xs="8" :sm="6" :md="6" :lg="6" :xl="3">
        <div class="option-buttons">
          <el-switch
            v-model="options.repeatRam"
            class="mt16"
            @change="prepareTable"
            active-text="Repeat RAM"
          />
          <br />
          <el-switch
            v-model="options.removeSource"
            class="mt16"
            @change="prepareTable"
            active-text="Remove source"
          />
          <br />
          <el-button id="copy-btn" class="mt16" type="primary" @click="copyTextNoInput"
            >Copy </el-button
          ><br />
        </div>
      </el-col>
    </el-row>

    <div class="m16">
      <h2 v-if="outputDict.length > 0" style="margin-bottom: 12px">Cleaned table</h2>
      <div v-html="mdProcessor(pcptLink)" style="margin-bottom: 6px" />
      <table class="mt-10">
        <thead>
          <tr>
            <th v-for="(value, id) in tableHeader" :key="id">
              {{ value }}
            </th>
          </tr>
        </thead>
        <tr v-for="(row, index) in outputDict" :key="index">
          <td v-for="(value, key) in row" :key="index + '-' + key">
            <span
              v-html="mdProcessor(value)"
              v-if="
                !editingCell.editing || editingCell.rowId !== index || key !== 'Selection'
              "
            />
            <el-input
              v-if="
                editingCell.editing && editingCell.rowId === index && key === 'Selection'
              "
              size="small"
              v-model="newCellValue"
              @keypress.enter="handleEditDone"
              :id="'edit-cell-' + index"
            />
            <span
              @click="handleEdit(index)"
              v-if="key === 'Selection' && !editingCell.editing"
              class="edit-button"
              >edit
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import configData from "@/assets/config.json";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      rowData: "",
      config: configData,
      pcptLink: "",
      rawTableData: [],
      tableHeader: [],
      outputDict: [],
      outputMd: "",
      options: {
        removeSource: true,
        repeatRam: false,
      },
      editedNames: [],
      rowTypeMaster: {
        1: "link",
        2: "separator",
        3: "row",
        9: "unclassified",
      },
      newCellValue: "",
      editingCell: {
        editing: false,
        value: "",
        rowId: -1,
        link: "",
      },
      signatureLink: "[PCPT Cleaner](https://pcptcleaner.sillypot.in)",
    };
  },

  methods: {
    identifyMd(string) {
      if (string.includes("](") && !string.includes("|")) {
        return 1;
      }
      const pattern = /[a-zA-Z0-9]/;
      if (string.includes("-") && string.includes("|") && !pattern.test(string)) {
        return 2;
      }
      if (string.includes("|") && pattern.test(string)) {
        return 3;
      }
      return 9;
    },

    removeUnwantedWords(string) {
      const CLWR = this.config.commonLongWordReplacements;
      for (let key in CLWR) {
        string = string.replace(key, CLWR[key]);
      }

      var values = string.split(" ");
      var words = [];

      values.forEach((value) => {
        if (
          !this.config.unwantedWords.includes(value.toLowerCase()) &&
          value.length < 13
        ) {
          words.push(value);
        }
      });

      return words.slice(0, 8).join(" ");
    },

    removeBrackets(text) {
      let word = [];
      let stack = 0;

      for (let char of text) {
        if (!stack && char !== "(") {
          word.push(char);
        }
        stack += { "(": 1, ")": -1 }[char] || 0;
      }

      return word.join("");
    },

    cleanSource(source) {
      if (typeof source === "undefined" || source === null || source === "") {
        return null;
      }
      source = source.trim();
      let parts = source.split(" ");
      if (parts[0].toLowerCase() == "the") {
        parts.splice(0, 1);
      }
      return parts[0];
    },

    cleanRow(string) {
      var values = string.split("|");

      var name = values[0].replaceAll("**", "").trim();
      values[0] = this.config.itemMap[name] || name;
      values[2] = this.cleanSource(values[2]);

      string = values[1].trim();
      if (string === "") {
        return null;
      }
      var link = null;
      if (string.includes("](")) {
        var [string, link] = string.slice(1, -2).split("](");
      }
      string = this.removeBrackets(string);
      string = this.removeUnwantedWords(string);

      this.editedNames.forEach((obj) => {
        if (obj["oldName"] === string) {
          string = obj["newName"];
        }
      });

      values[1] = link === null ? string : `[${string}](${link})`;
      return values.join("|");
    },

    handleRow(string) {
      const cleanEle = this.cleanRow(string);
      if (cleanEle) {
        this.rawTableData.push(cleanEle);
      }
    },

    identifyAllRows(string) {
      let rows = string.split("\n");
      this.pcptLink = "";
      this.rawTableData = [];
      rows.forEach((element) => {
        var type = this.identifyMd(element);
        if (type === 1) {
          this.pcptLink = element;
        }
        if (type === 3) {
          this.handleRow(element);
        }
      });

      this.mdToDict(this.rawTableData);
    },

    prepareTable() {
      if (this.rowData === "") {
        return null;
      }
      this.identifyAllRows(this.rowData);
      var table = this.outputDict;

      if (this.options.repeatRam) {
        const targetIndex = table.findIndex((obj) => obj.Item === "RAM");
        const newRow = JSON.parse(
          JSON.stringify(table[targetIndex]).replace("RAM", "RAM2")
        );
        table.splice(targetIndex + 1, 0, newRow);
      }
      //add total row
      const totalPrice = table.reduce((total, item) => {
        const itemPrice = parseInt(item.Price);
        return total + (isNaN(itemPrice) ? 0 : itemPrice);
      }, 0);
      table.push({
        Item: " ",
        Selection: "**Total**",
        Source: "",
        Price: "**" + totalPrice + "**",
      });

      if (this.options.removeSource) {
        table = table.map(({ Item, Selection, Price, ...rest }) => ({
          Item,
          Selection,
          Price,
        }));
        this.tableHeader.splice(2, 1);
      }

      this.outputDict = table;
    },

    mdToDict(MdString) {
      let header = MdString[0].split("|");
      this.tableHeader = header;
      let configDict = MdString.slice(1).map((row) => {
        let values = row.split("|");
        let obj = {};
        header.forEach((header, index) => {
          obj[header] = values[index]?.trim();
        });
        return obj;
      });
      this.outputDict = configDict;
    },

    dictToMd(arr) {
      let headerItems = Object.keys(arr[0]);
      let header = headerItems.join("|");
      let sep = "----|";
      let separator = sep.repeat(headerItems.length - 1) + sep.slice(0, -1);
      this.outputMd = header + "\n";
      this.outputMd += separator + "\n";

      arr.forEach((part) => {
        this.outputMd += Object.values(part).join("|") + "\n";
      });
    },

    mdProcessor(string) {
      if (typeof string === "undefined" || string === "" || string === null) {
        return null;
      }
      if (typeof string === "number") {
        return string;
      }

      if (string.startsWith("**") && string?.endsWith("**")) {
        string = string.replaceAll("**", "");
        return `<span style="font-weight: bold;">${string}</span>`;
      }
      if (string.indexOf("](") != -1) {
        var parts = string.split("](");
        var link = parts[1].slice(0, -1);
        var text = parts[0].slice(1);
        return `<a href="${link}">${text}</a>`;
      }
      return "<span>" + string + "</span>";
    },

    handleEdit(row) {
      var curVal = this.outputDict[row].Selection;
      this.editingCell.value = curVal.slice(1, curVal.indexOf("]"));
      this.editingCell.link = curVal.slice(curVal.indexOf("(") + 1, -2);
      this.editingCell.editing = true;
      this.editingCell.rowId = row;
      this.newCellValue = this.editingCell.value;
    },

    handleEditDone() {
      let editDict = { oldName: this.editingCell };
      var row = this.editingCell.rowId;
      this.outputDict[row].Selection = `[${this.newCellValue}](${this.editingCell.link})`;
      this.editedNames.push({
        oldName: this.editingCell.value,
        newName: this.newCellValue,
      });
      this.newCellValue = "";
      this.editingCell.editing = false;
      this.dictToMd(this.outputDict);
    },

    copyTextNoInput() {
      console.log("copy called");
      if (this.outputDict.length === 0) {
        ElMessage({
          message: "Table is blank",
          type: "warning",
        });
        return null;
      }
      this.dictToMd(this.outputDict);
      const storage = document.createElement("textarea");
      storage.value = this.pcptLink + "\n\n";
      storage.value += this.outputMd;
      storage.value += "\nMade with " + this.signatureLink;
      document.body.appendChild(storage);
      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(storage);
      ElMessage({
        message: "Copied successfully",
        type: "success",
      });
    },
  },
};
</script>

<style>
.m16 {
  margin: 16px 0 0 16px;
}
.mt16 {
  margin-top: 16px;
}
table,
td,
th {
  border-bottom: 1.5px solid #61d7c3;
  border-collapse: collapse;
  padding: 4px;
}
th {
  font-weight: bold;
  background-color: #61d7c3;
  color: rgba(0, 0, 0, 0.7);
}
table {
  width: 96vw;
  max-width: 660px;
}

.edit-button {
  position: relative;
  display: flex;
  float: right;
  color: rgb(14, 178, 223);
  cursor: pointer;
}

.option-buttons {
  margin-left: 1rem;
}
.border {
  border: 1px solid gray;
  border-radius: 4px;
}
#copy-btn {
  width: 95%;
}
</style>
