<template>
  <div>
    <h2>This is PCPT page</h2>
    <p>Welcome {{ name }}</p>
    <el-input
      v-model="textarea"
      style="width: 600px"
      :rows="12"
      type="textarea"
      placeholder="Type something"
      name="rawInput"
      @input="doNothing"
    /><br />
    <el-switch v-model="repeatRam" size="small" @change="doNothing" /> Repeat RAM
    <el-switch v-model="removeSource" size="small" @change="doNothing" /> Remove Source

    <br />
    <div v-html="mdProcessor(pcptLink)" />
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
    <div>
      Mobile friendly table made with <span v-html="mdProcessor(signatureLink)" />
    </div>
    <el-button type="primary" @click="copyTextNoInput">Copy</el-button>
    <div>{{ outputMd }}</div>
  </div>
</template>

<script>
import configData from "@/assets/config.json";

export default {
  components: {},
  data() {
    return {
      name: "Gourav Kumar",
      signatureLink: "[PCPTCleaner](https://pcptcleaner.github.io)",
      repeatRam: false,
      removeSource: false,
      textarea: "",
      outputDict: [],
      outputMd: "",
      pcptLink: "",
      tableHeader: [],
      newCellValue: "",
      editingCell: {
        editing: false,
        value: "",
        rowId: -1,
        link: "",
      },
      itemMap: configData["itemMap"],
      unwantedWords: configData["unwantedWords"],
      commonLongWordReplacements: configData["commonLongWordReplacements"],
    };
  },
  methods: {
    isAlphaNumeric(string) {
      const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)/;
      return regex.test(string);
    },

    lenSansSymbols(string) {
      return Array.from(string).filter((char) => /[a-zA-Z0-9]/.test(char)).length;
    },
    smartCapitalize(string) {
      if (string.includes(" ")) {
        throw new Error("Argument contains spaces. Pass only one word at a time");
      }

      const symbols = "./-";
      const symbolsInString = Array.from(symbols).map((symbol) => [
        symbol,
        string.includes(symbol),
      ]);

      for (let [c, b] of symbolsInString) {
        if (b) {
          string = string.split(c).map(this.smartCapitalize).join(c);
        }
      }

      if (symbolsInString.some(([c, b]) => b)) {
        return string;
      }

      const vowels = "aeiou";
      const isAlphaNumeric = (str) => /^[a-z0-9]+$/i.test(str);

      let newString;
      if (string.length < 5) {
        const vowelCount = Array.from(string).filter((char) => vowels.includes(char))
          .length;
        if (
          vowelCount === 1 &&
          (vowels.includes(string[0]) || vowels.includes(string[string.length - 1]))
        ) {
          newString = string.toUpperCase();
        } else if (vowelCount === 0) {
          newString = string.toUpperCase();
        } else {
          newString = string.charAt(0).toUpperCase() + string.slice(1);
        }
      } else if (this.isAlphaNumeric(string)) {
        newString = string.toUpperCase();
      } else {
        newString = string.charAt(0).toUpperCase() + string.slice(1);
      }
      return newString;
    },

    removeBrackets(string) {
      let openBrackets = [];
      let closeBrackets = [];

      for (let i = 0; i < string.length; i++) {
        if (string[i] === "(") {
          openBrackets.push(i);
        } else if (string[i] === ")") {
          closeBrackets.push(i);
        }
      }

      if (openBrackets.length !== closeBrackets.length) {
        console.log("Failure");
        return string; // Early return in case of mismatch
      }

      openBrackets.reverse();
      closeBrackets.reverse();

      let bracketPairs = openBrackets.map((o, i) => [o, closeBrackets[i]]);

      for (let [o, c] of bracketPairs) {
        string = (string.slice(0, o).trim() + " " + string.slice(c + 1).trim()).trim();
      }

      return string;
    },

    cleanMarkup(markup) {
      let rows = markup.split("\n");
      let cleanRows = rows.filter((i) => i);

      let startRow = 0;
      let link = "";
      for (var i = 0; i < 4; i++) {
        if (cleanRows[i].includes("](")) {
          this.pcptLink = cleanRows[i];
          link = cleanRows[i];
        }
        if (!cleanRows[i].includes("|")) {
          startRow += 1;
        }
      }

      let headers = cleanRows[startRow].split("|");
      headers[0] = "Item";

      let table = cleanRows.slice(startRow + 2);
      console.log(table);
      let configDict = table
        .map((row) => {
          let values = row.split("|");
          let obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index]?.trim();
          });
          return obj;
        })
        .filter((i) => i["Selection"].trim());
      console.log(configDict);

      for (let i of configDict) {
        let itemPair = i["Selection"]?.split("]");
        let item = this.removeBrackets(itemPair[0].substring(1).toLowerCase());
        item = item
          .split(" ")
          .filter((word) => !this.unwantedWords?.includes(word))
          .slice(0, 8)
          .join(" ");

        let ite = item
          .split(" ")
          .filter((j) => this.lenSansSymbols(j) <= 12 || !this.isAlphaNumeric(j))
          .map((j) => this.smartCapitalize(j));
        item = ite.join(" ");

        for (let [k, v] of Object.entries(this.commonLongWordReplacements)) {
          item = item.replace(k, v);
        }

        i["Selection"] = `[${item}]${itemPair[1]}`;
        i["Item"] = this.itemMap[i["Item"]] || i["Item"];
        i["Source"] = i["Source"].split(" ")[0];
      }

      if (this.repeatRam) {
        let ramList = configDict
          .map((j, i) => [i, j])
          .filter(([i, j]) => j["Item"] === "RAM");

        let ramDict = { ...ramList[0][1] };
        ramDict["Item"] = "RAM2";
        configDict.splice(ramList[0][0] + 1, 0, ramDict);
      }

      let totalPrice = configDict.reduce((sum, i) => sum + parseInt(i["Price"]), 0);
      let totalPriceMarkup = `**Total**|${
        this.removeSource ? "" : "|"
      }|**${totalPrice}**`;

      if (this.removeSource) {
        configDict.forEach((i) => delete i["Source"]);
      }

      let prettyMarkup = [];
      let keys = Object.keys(configDict[0]);

      prettyMarkup.push(keys.join("|"));
      let sep = "----|----|----" + (this.removeSource ? "" : "|----");
      prettyMarkup.push(sep);
      for (let i of configDict) {
        prettyMarkup.push(Object.values(i).join("|"));
      }

      prettyMarkup.push(totalPriceMarkup);
      let configTable = link + "\n" + prettyMarkup.join("\n");
      this.pcptLink = link;
      return configTable;
    },

    linkifyMarkdown(string) {
      if (string.includes("log")) {
        console.log(string);
      }
      if (string.indexOf("](") === -1) {
        return "<p>" + string + "</p>";
      }
      var parts = string.split("](");
      var link = parts[1].slice(0, -1);
      var text = parts[0].slice(1);
      return `<a href="${link}">${text}</a>`;

      // return string;
    },

    doNothing(string) {
      console.log("doNothing called");

      if (this.textarea === "") {
        return null;
      }

      this.outputMd = this.cleanMarkup(this.textarea);
      this.mdToDict(this.outputMd);
      return string;
    },

    mdToDict(MdString) {
      if (MdString === "") {
        return null;
      }
      let splitString = MdString.split("\n");
      var startRow = 0;
      for (var i = 0; i < 4; i++) {
        // if (splitString[i].includes("](")) {
        //   this.pcptLink = splitString[i];
        //   // startRow += 1;
        // }

        if (!splitString[i].includes("|")) {
          startRow += 1;
        }
      }
      let header = splitString[startRow].split("|");
      this.tableHeader = header;

      let configDict = splitString.slice(startRow + 2).map((row) => {
        let values = row.split("|");
        let obj = {};
        header.forEach((header, index) => {
          obj[header] = values[index]?.trim();
        });
        return obj;
      });
      // .filter((i) => i["Selection"].trim());
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
      if (typeof string === "undefined") {
        return null;
      }

      if (string.startsWith("**") && string?.endsWith("**")) {
        string = string.replaceAll("**", "");
        return `<p style="font-weight: bold;">${string}</p>`;
      }
      if (string.indexOf("](") != -1) {
        var parts = string.split("](");
        var link = parts[1].slice(0, -1);
        var text = parts[0].slice(1);
        return `<a href="${link}">${text}</a>`;
      }
      return "<p>" + string + "</p>";
    },

    handleEdit(row) {
      console.log(this.outputDict[row].Selection);
      var curVal = this.outputDict[row].Selection;
      this.editingCell.value = curVal.slice(1, curVal.indexOf("]"));
      this.editingCell.link = curVal.slice(curVal.indexOf("(") + 1, -2);
      this.editingCell.editing = true;
      this.editingCell.rowId = row;
      this.newCellValue = this.editingCell.value;
    },

    handleEditDone() {
      var row = this.editingCell.rowId;
      this.outputDict[row].Selection = `[${this.newCellValue}](${this.editingCell.link})`;
      this.newCellValue = "";
      this.editingCell.editing = false;
      this.dictToMd(this.outputDict);
    },

    copyTextNoInput() {
      console.log("copy called");
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
    },
  },
  computed: {},
};
</script>

<style scoped>
table,
td,
th {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 4px;
}
th {
  font-weight: bold;
  background-color: #ededed;
}
table {
  width: 90vw;
  max-width: 660px;
}
.edit-button {
  position: relative;
  display: flex;
  float: right;
  color: rgb(14, 178, 223);
  cursor: pointer;
  /* right: 4px; */
}
</style>
