const puppeteer = require('puppeteer');
const xlsx = require("xlsx");


async function getdata(url,page) {
  
// const browser =await puppeteer.launch({headless:false});
// const page=await browser.newPage();
await page.goto(url,{timeout: 0});

const name1 = await page.$eval(".type-h2",name1=>name1.textContent);
const location1 = await page.$eval(".location",location1=>location1.textContent);
const str =location1;
const city1=str.split(',')[0];
const state1=str.split(',')[1];
const phoone1 = await page.$eval(".phone",phoone1=>phoone1.textContent);
const mail1 = await page.$eval(".color-orange ",mail1=>mail1.textContent);
const desc1= await page.$eval(".description",desc1=>desc1.textContent);

// console.log(name);
// console.log(location);
// console.log(phoone);
// console.log(mail);
// console.log(desc);
return{
  name:name1,
  city:city1,
  state:state1,
  phoone:phoone1,
  mail:mail1,
  desc:desc1
}
 

};

async function getlinks()
{
  const browser =await puppeteer.launch({headless:false});
  const page=await browser.newPage();
  await page.goto('https://www.compassioninstitute.com/about-us/teacher-directory/',{timeout: 0});

  const links=await page.$$eval('.button a',allAs=>allAs.map(a=>a.href));
  await browser.close;

  return links;
}

async function main(){
 const alllinks=  await getlinks();

const browser =await puppeteer.launch({headless:false});
const page=await browser.newPage();
const sd=[];

for(link of alllinks){
  const data=await getdata(link,page);
  sd.push(data);
}


console.log(sd);
const wb=xlsx.utils.book_new();
const ws =xlsx.utils.json_to_sheet(sd);
xlsx.utils.book_append_sheet(wb,ws);
xlsx.writeFile(wb,"data2.xlsx");

}
main();