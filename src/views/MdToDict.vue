<template>
  <div>
    <h3>Convert dict to markdown</h3>
    <el-input
      v-model="md"
      style="width: 600px"
      :rows="15"
      type="textarea"
      placeholder="Type something"
    /><br />
    <el-button type="primary" @click="mdToDict(md)">Convert</el-button>
    <el-button type="primary" @click="dictToMd(outputDict)">Load</el-button>
    <div class="mt-10">{{ outputDict }}</div>
    <div class="mt-10">
      Category|Selection|Source|Price <br />
      :----|:----|:----|----: <br />
      **CPU** | [I3-12100F](https://pcpricetracker.in/) | Vedant | 8555 <br />
      **Mobo** | [ASRock H610M](https://pcpricetracker.in/) | MDComp | 6650
    </div>
    <el-input
      v-model="outputMd"
      style="width: 600px"
      class="mt-10"
      :rows="15"
      type="textarea"
      placeholder="Type something"
    />
    <div v-html="mdProcessor(pcptLink)" class="mt-10" />

    <table class="mt-10">
      <thead>
        <tr>
          <th v-for="(value, id) in tableHeader" :key="id">
            {{ value }}
          </th>
        </tr>
      </thead>
      <tr v-for="(row, index) in outputDict" :key="index">
        <td
          v-for="(value, idx) in Object.values(row)"
          :key="index + '-' + idx"
          v-html="mdProcessor(value)"
        />
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      md: "",
      outputDict: [],
      outputMd: "",
      pcptLink: "",
      tableHeader: [],
    };
  },
  methods: {
    mdToDict(MdString) {
      let splitString = MdString.split("\n");
      var startRow = 0;
      for (var i = 0; i < 4; i++) {
        if (splitString[i].includes("](")) {
          this.pcptLink = splitString[i];
          // startRow += 1;
        }

        if (!splitString[i].includes("|")) {
          console.log("includes" + splitString[i]);
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
      console.log(arr.slice(1));
      arr.forEach((part) => {
        this.outputMd += Object.values(part).join("|") + "\n";
        // console.log(this.outputMd);
      });
      // this.outputMd += JSON.stringify(arr.slice(1));
    },

    mdProcessor(string) {
      // console.log(string + ' ## ' + console.log(type));
      if (typeof string === "undefined") {
        return null;
      }
      console.log(string);
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
  },
};
</script>

<style>
.mt-10 {
  margin-top: 20px;
}

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
</style>
