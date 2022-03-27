const puppeteer = require('puppeteer');
const xlsx = require("xlsx");
// const obj = null;
// const newObj = obj || undefined;

async function getdata(url,page) {
  
// const browser =await puppeteer.launch({headless:false});
// const page=await browser.newPage();
await page.goto(url,{timeout: 0});
try{
    await page.waitForSelector('div.peter_info > ul:nth-child(4) > li');
const name1 = await page.$eval("div > div.peter_title > h1",name1=>name1.textContent);
const strn =name1;
const fn=strn.split(' ')[0];
const ln=strn.split(' ').pop();

const location1 = await page.$eval("div > div.peter_info > ul:nth-child(2) > li",location1=>location1.textContent);
const str =location1;
const city1=str;
const Country1=str.split(','). pop() ;
const lang = await page.$eval("div.peter_info > ul:nth-child(4) > li",lang=>lang.textContent);

// const phoone1 = await page.$eval(".phone",phoone1=>phoone1.textContent);
const mail1 = await page.$eval(".con_btn > a ",mail1=>mail1.href);
const strnn =mail1;
const fnn=strnn.split(':')[0];
const lnn=strnn.split(':').pop();

const desc1= await page.$eval(".teach_content",desc1=>desc1.textContent);

const a= await desc1.includes("MBSR");
const b= await desc1.includes("Mindfullness Based Stress Reduction");
const c= await desc1.includes("Therapist");
const d= await desc1.includes("Psychologist");
const e= await desc1.includes("PhD");
const f= await desc1.includes("Masters");
const g= await desc1.includes("MA");

// const a= await desc1.includes("MBSR");
// if(a){
//     a="yes";
// }
// else{
//     a="no";
// }
// const b= await desc1.includes("Mindfullness Based Stress Reduction");
// if(b){
//     b="yes";
// }
// else{
//     b="no";
// }
// const c= await desc1.includes("Therapist");
// if(c){
//     c="yes";
// }
// else{
//     c="no";
// }
// const d= await desc1.includes("Psychologist");
// if(d){
//     d="yes";
// }
// else{
//     d="no";
// }
// const e= await desc1.includes("PhD");
// if(e){
//     e="yes";
// }
// else{
//     e="no";
// }
// const f= await desc1.includes("Masters");
// if(f){
//     f="yes";
// }
// else{
//     f="no";
// }
// const g= await desc1.includes("MA");
// if(g){
//     g="yes";
// }
// else{
//     g="no";
// }




return{
  FName:fn,
  LName:ln,
  email:lnn,
  Residence:city1,
  Country:Country1,
  Languages:lang,
  Biography:desc1,
 
  //condition data

MBSR:a,
Mindfullness_Based_Stress_Reduction:b,
Therapist:c,
Psychologist:d,
PhD:e,
Masters:f,
MA:g

}
}
catch(e){

}

};

async function getlinks()
{
  const browser =await puppeteer.launch({headless:false});
  const page1=await browser.newPage();

  await page1.goto('https://siyli.org/certified-teachers/',{timeout: 0});
  for (let i = 0; i < 25; i++) {
    // await page.waitFor('#load_more_apply_teachers')
    await page1.click('#load_more_apply_teachers');
    
  }
  await page1.waitFor(40000);
  const links=await page1.$$eval('.anchor-row',allAs=>allAs.map(a=>a.href));
  
  await browser.close;
  console.log(links);
  return links;
  
}

async function main(){
 const alllinks=  await getlinks();

const browser =await puppeteer.launch({headless:false});
const page=await browser.newPage();

const sd=[];

for(link of alllinks){
    
  const data=await getdata(link,page);


   
// MBSR:a,
// Mindfullness_Based_Stress_Reduction:b,
// Therapist:c,
// Psychologist:d,
// PhD:e,
// Masters:f,
// MA:g
  console.log(data);
  if (typeof data === "undefined"){

  }
  else{
    if(data.MBSR){
        data.MBSR='yes';
      }
      else{
        data.MBSR='no';
      }
      if(data.Mindfullness_Based_Stress_Reduction){
        data.Mindfullness_Based_Stress_Reduction='yes';
      }
      else{
        data.Mindfullness_Based_Stress_Reduction='no';
      }
      if(data.Therapist){
        data.Therapist='yes';
      }
      else{
        data.Therapist='no';
      }
    
      if(data.Psychologist){
        data.Psychologist='yes';
      }
      else{
        data.Psychologist='no';
      }
    
      if(data.PhD){
        data.PhD='yes';
      }
      else{
        data.PhD='no';
      }
    
      if(data.Masters){
        data.Masters='yes';
      }
      else{
        data.Masters='no';
      }
    
      if(data.MA){
        data.MA='yes';
      }
      else{
        data.MA='no';
      }
  sd.push(data);
  }
  

}


console.log(sd);
const wb=xlsx.utils.book_new();
const ws =xlsx.utils.json_to_sheet(sd);
xlsx.utils.book_append_sheet(wb,ws);
xlsx.writeFile(wb,"test14.xlsx");

}
main();