const fs = require("fs");
const yaml = require("node-yaml");

//constatns
const bar = "▎";

//Path to the folder of databse folders
let inDir = "./files/in/";
let outDir = "./files/out/";

let files = fs.readdirSync(inDir);

let startTime = Date.now();
let count = 0;

files.forEach((file) => {
  if (!file.endsWith(".yml")) return;

  let data = yaml.readSync(inDir + file);

  //parse data time

  const hexcolor = data.display.name.match(/&#[0-9a-f]{6}/i);
  const category = data.display.name.split(" ")[0].replace(/&#[0-9a-f]{6}/i, "");

  let lns = [];
  //remove all colors and format from the data
  data.display["lore-normal"].forEach((line, i) => {
    lns[i] = line.replace(/&[a-fk-o0-9]|&#[a-f0-9]{6}|■/gi, "").trim();
  });

  let objIndex = lns.findIndex((l) => l.startsWith("Objective"));
  let progressIndex = lns.findIndex((l) => l.startsWith("Progress"));
  let rewardIndex = lns.findIndex((l) => l.includes("$"));

  let objectiveArr = lns[objIndex].split(" ");
  objectiveArr.shift();
  let objective = `${objectiveArr.join(" ")}`;

  let itemId = lns[progressIndex].split(":")[1].replace("{", "");
  let progressSuffix = lns[progressIndex].split("/")[1];

  const cashAmount = lns[rewardIndex].substring(lns[rewardIndex].indexOf("$") + 1);

  //set lore
  let newLines = [
    "",
    `${hexcolor}${bar} &fTask: ${hexcolor}${category}`,
    "",
    `${hexcolor}${bar} &fObjective: &7${objective}`,
    `${hexcolor}${bar} &fProgress: &7{${itemId}:progress}x&8/&7${progressSuffix}`,
    "",
    `${hexcolor}${bar} &fRewards:`,
    `${hexcolor}${bar}   &7Cash: £${cashAmount}`,
  ];

  data.display.name = `${hexcolor}${category} Task &8| &f${objective}`;
  data.display["lore-normal"] = newLines;
  data.display["lore-started"] = [""];

  data.rewardstring = [
    `&7You've completed the &a${objective} &7task!`,
    `&7Your rewards have been automatically given to you!`,
  ];

  //write
  yaml.writeSync(outDir + file, data);

  count++;
});

console.log(["Done!", `Processed ${count} files in ${Date.now() - startTime}ms!`].join("\n"));
