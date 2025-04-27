const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const port = 3006;

//const port = 3007;

const webCrawlerRouter = require("./routes/webcrawler");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const editUserRouter = require("./routes/edituserrouter");
const deleteUserRouter = require("./routes/deleteuserrouter");
const listUserRouter = require("./routes/listuser");
const getUserByIdRouter = require("./routes/getuserbyid");
const uploadExcelRouter = require("./routes/uploadexcel");

const formidable = require('formidable');
var Excel = require('exceljs');
var lineReader = require('line-reader');
var fs = require('fs');

const upload_excel_update_master_sugar_stock_Router = require("./routes/upload_excel_update_master_sugar_stock");
const upload_excel_update_master_sprocket_pricelist_Router = require("./routes/upload_excel_update_master_sprocket_pricelist");
const upload_excel_update_master_small_size_chain_pricelist_Router = require("./routes/upload_excel_update_master_small_size_chain_pricelist");
const upload_excel_update_master_ptuc_other_dist_Router = require("./routes/upload_excel_update_master_ptuc_other_dist");
const upload_excel_update_master_ptuc_kte_Router = require("./routes/upload_excel_update_master_ptuc_kte");
const upload_excel_update_master_kte_stock_Router = require("./routes/upload_excel_update_master_kte_stock");
const upload_excel_update_master_jpy_chain_Router = require("./routes/upload_excel_update_master_jpy_chain");
const upload_excel_update_master_akt_format_warehouse_pricelist_Router = require("./routes/upload_excel_update_master_akt_format_warehouse_pricelist");
const upload_excel_update_master_akt_format_scg_group_chain_Router = require("./routes/upload_excel_update_master_akt_format_scg_group_chain");
const upload_excel_update_master_akt_format_scg_group_cam_clutch_Router = require("./routes/upload_excel_update_master_akt_format_scg_group_cam_clutch");
const upload_excel_update_master_akt_format_kabelschlepp_Router = require("./routes/upload_excel_update_master_akt_format_kabelschlepp");
const upload_excel_update_master_drivechain_Router = require("./routes/upload_excel_update_master_drivechain");
const upload_excel_update_user_data_tsubakimoto_Router = require("./routes/upload_excel_update_user_data_tsubakimoto");

const clear_master_tsubakimoto_database_Router = require("./routes/clear_master_tsubakimoto_database");

const get_master_akt_format_kabelschlepp_Router = require("./routes/get_master_akt_format_kabelschlepp");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors());

app.get("/", (req, res) => {
  res.json({ "API for Tsubakimoto Pricelist System": "ok" });
});

app.post("/master_history/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from master_pricelist_history";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/master_history/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from master_pricelist_history where ";
    sql += "master_file_id=";
    sql += req.body.Id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from master_pricelist_history":
                  {
                   "result": "pass",
                   "id": req.body.Id
                  }
                 }
               )
              );
    res.end();
});

app.post("/master_data/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from master_tsubakimoto";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/master_data/deleteall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "delete from master_tsubakimoto";
 console.log(sql);
 await db.query(sql);
 res.writeHead(200, {'Content-Type': 'application/json'});
 res.write
 (
         JSON.stringify
         (
              {
                 "status":true,
                 "deleteall":
                  {
                    "table": "master_tsubakimoto",
                    "result": "pass"
                  }
              }
         )
 );
 res.end();
});

app.post("/master_data/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from master_tsubakimoto where ";
    sql += "Id=";
    sql += req.body.Id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from master_data":
                  {
                   "result": "pass",
                   "id": req.body.Id
                  }
                 }
               )
              );
    res.end();
});

/*
app.post("/master_data/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath =  'uploaded_files/myupload.xlsx';
     fs.rename(oldpath, newpath, function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
          wb.xlsx.readFile('uploaded_files/myupload.xlsx').then(function(){
          wb.csv.writeFile('uploaded_files/myupload.csv' )
          .then(async function() {
          console.log("saved csv...done");
          var line_cnt=0;
          lineReader.eachLine('uploaded_files/myupload.csv', async function(line, last) {
          line_cnt++;
          if (line_cnt >= 17)
          {
           var arr = line.split(",");
           for(var i=0;i<arr.length;i++) {
            if (arr[i]=="" || arr[i].indexOf('sharedFormula')!=-1) arr[i] = "blank";
            var token_number = i + 1;
            console.log("token #"+ token_number + ") " + arr[i]);
           }
           console.log("---");
           sql="insert into master_tsubakimoto(category,part_no,previous_model_no,new_model_no,unit,manufacturer_suggested_retail_price,new_manufacturer_suggested_retail_price,conversion_to_ft,diff_for_cost,op_price,po_price_jpy_usd,po_price_currency,remark,thb_cost,gp,pricelist_name,multiplier,make_same_price_as_standard_price,new_make_same_price_as_standard_price,standard_price,diff,dist_pl_mull,dist_ex_rate,unit_price,new_unit_price,diff_unit_price,status,supplier_name,stock_reference,cutting_assembly,detail)";
           sql += " values ('";
           sql += arr[0];
           sql += "','";
           sql += arr[1];
           sql += "','";
           sql += arr[2];
           sql += "','";
           sql += arr[3];
           sql += "','";
           sql += arr[4];
           sql += "','";
           sql += arr[5];
           sql += "','";
           sql += arr[6];
           sql += "','";
           sql += arr[7];
           sql += "','";
           sql += arr[8];
           sql += "','";
           sql += arr[9];
           sql += "','";
           sql += arr[10];
           sql += "','";
           sql += arr[11];
           sql += "','";
           sql += arr[12];
           sql += "','";
           sql += arr[13];
           sql += "','";
           sql += arr[14];
           sql += "','";
           sql += arr[15];
           sql += "','";
           sql += arr[16];
           sql += "','";
           sql += arr[17];
           sql += "','";
           sql += arr[18];
           sql += "','";
           sql += arr[19];
           sql += "','";
           sql += arr[20];
           sql += "','";
           sql += arr[21];
           sql += "','";
           sql += arr[22];
           sql += "','";
           sql += arr[23];
           sql += "','";
           sql += arr[24];
           sql += "','";
           sql += arr[25];
           sql += "','";
           sql += arr[26];
           sql += "','";
           sql += arr[27];
           sql += "','";
           sql += arr[28];
           sql += "','";
           sql += arr[29];
           sql += "','";
           sql += arr[30];
           sql += "')";
           console.log(sql);
           await db.query(sql);
           }
          if(last){
          }
          });
          });
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write
          (
           JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "pass",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
         });
        }
     });
     });
});
*/


/*
app.post("/master_data/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath =  'uploaded_files/myupload.xlsx';
     fs.rename(oldpath, newpath, async function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
                    const content = await wb.xlsx.readFile(newpath);
                    const worksheet = content.worksheets[0];
                    const rowStartIndex = 5;
                    const numberOfRows = worksheet.rowCount - 4;
                    const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
                    rows.map((row) => {
                          sql="insert into master_tsubakimoto(category,part_no,previous_model_no,new_model_no,unit,manufacturer_suggested_retail_price,new_manufacturer_suggested_retail_price,conversion_to_ft,diff_for_cost,op_price,po_price_jpy_usd,po_price_currency,remark,thb_cost,gp,pricelist_name,multiplier,make_same_price_as_standard_price,new_make_same_price_as_standard_price,standard_price,diff,dist_pl_mull,dist_ex_rate,unit_price,new_unit_price,diff_unit_price,status,supplier_name,stock_reference,cutting_assembly,detail)";
                          sql += " values ('";
                          value = row.getCell(1).formula;

//                          row.getCell(1).numFmt = '@';;
//                          row.getCell(2).numFmt = '@';
//                          row.getCell(3).numFmt = '@';
//                          row.getCell(4).numFmt = '@';
//                          row.getCell(5).numFmt = '@';
//                          row.getCell(6).numFmt = '@';
//                          row.getCell(7).numFmt = '@';
//                          row.getCell(8).numFmt = '@';
//                          row.getCell(9).numFmt = '@';
//                          row.getCell(10).numFmt = '@';
//                          row.getCell(11).numFmt = '@';
//                          row.getCell(12).numFmt = '@';
//                          row.getCell(13).numFmt = '@';
//                          row.getCell(14).numFmt = '@';
//                          row.getCell(15).numFmt = '@';
//                          row.getCell(16).numFmt = '@';
//                          row.getCell(17).numFmt = '@';
//                          row.getCell(18).numFmt = '@';
//                          row.getCell(19).numFmt = '@';
//                          row.getCell(20).numFmt = '@';
//                          row.getCell(21).numFmt = '@';
//                          row.getCell(22).numFmt = '@';
//                          row.getCell(23).numFmt = '@';
//                          row.getCell(24).numFmt = '@';
//                          row.getCell(25).numFmt = '@';
//                          row.getCell(26).numFmt = '@';
//                          row.getCell(27).numFmt = '@';
//                          row.getCell(28).numFmt = '@';
//                          row.getCell(29).numFmt = '@';
//                          row.getCell(30).numFmt = '@';
//                          row.getCell(31).numFmt = '@';

                          sql += value ? (row.getCell(1).result != '') || row.getCell(1).result || row.getCell(1).result==0 ? row.getCell(1).result : ''  : row.getCell(1).value ? row.getCell(1).value : '';

                          sql += "','";
                          value = row.getCell(2).formula;
                          sql += value ? (row.getCell(2).result != '') || row.getCell(2).result || row.getCell(2).result==0  ? row.getCell(2).result : ''  : row.getCell(2).value ? row.getCell(2).value : '';

                          sql += "','";
                          value = row.getCell(3).formula;
                          sql += value ? (row.getCell(3).result != '') || row.getCell(3).result || row.getCell(3).result==0  ? row.getCell(3).result : ''  : row.getCell(3).value ? row.getCell(3).value : '';

                          sql += "','";
                          value = row.getCell(4).formula;
                          sql += value ? (row.getCell(4).result != '') || row.getCell(4).result || row.getCell(4).result==0  ? row.getCell(4).result : ''  : row.getCell(4).value ? row.getCell(4).value : '';

                          sql += "','";
                          value = row.getCell(5).formula;
                          sql += value ? (row.getCell(5).result != '') || row.getCell(5).result || row.getCell(5).result==0  ? row.getCell(5).result : ''  : row.getCell(5).value ? row.getCell(5).value : '';

                          sql += "','";
                          value = row.getCell(6).formula;
                          sql += value ? (row.getCell(6).result != '') || row.getCell(6).result || row.getCell(6).result==0  ? row.getCell(6).result : ''  : row.getCell(6).value ? row.getCell(6).value : '';

                          sql += "','";
                          value = row.getCell(7).formula;
                          sql += value ? (row.getCell(7).result != '')  || row.getCell(7).result || row.getCell(7).result==0 ? row.getCell(7).result : ''  : row.getCell(7).value ? row.getCell(7).value : '';

                          sql += "','";
                          value = row.getCell(8).formula;
                          sql += value ? (row.getCell(8).result != '')  || row.getCell(8).result || row.getCell(8).result==0  ? row.getCell(8).result : ''  : row.getCell(8).value ? row.getCell(8).value : '';

                          sql += "','";
                          value = row.getCell(9).formula;
                          sql += value ? (row.getCell(9).result != '')  || row.getCell(9).result || row.getCell(9).result==0  ? row.getCell(9).result : ''  : row.getCell(9).value ? row.getCell(9).value : '';

                          sql += "','";
                          value = row.getCell(10).formula;
                          sql += value ? (row.getCell(10).result != '') || row.getCell(10).result || row.getCell(10).result==0 ? row.getCell(10).result : ''  : row.getCell(10).value ? row.getCell(10).value : '';

                          sql += "','";
                          value = row.getCell(11).formula;
                          sql += value ? (row.getCell(11).result != '') || row.getCell(11).result || row.getCell(11).result==0  ? row.getCell(11).result : ''  : row.getCell(11).value ? row.getCell(11).value : '';

                          sql += "','";
                          value = row.getCell(12).formula;
                          sql += value ? (row.getCell(12).result != '') || row.getCell(12).result || row.getCell(12).result==0  ? row.getCell(12).result : ''  : row.getCell(12).value ? row.getCell(12).value : '';

                          sql += "','";
                          value = row.getCell(13).formula;
                          sql += value ? (row.getCell(13).result != '') || row.getCell(13).result || row.getCell(13).result==0  ? row.getCell(13).result : ''  : row.getCell(13).value ? row.getCell(13).value : '';

                          sql += "','";
                          value = row.getCell(14).formula;
                          sql += value ? (row.getCell(14).result != '') || row.getCell(14).result || row.getCell(14).result==0  ? row.getCell(14).result.toFixed(5) : ''  : row.getCell(14).value ? row.getCell(14).value : '';

                          sql += "','";
                          value = row.getCell(15).formula;
                          sql += value ? (row.getCell(15).result != '') || row.getCell(15).result || row.getCell(15).result==0  ? row.getCell(15).result.toFixed(5)  : ''  : row.getCell(15).value ? row.getCell(15).value : '';

                          sql += "','";
                          value = row.getCell(16).formula;
                          sql += value ? (row.getCell(16).result != '') || row.getCell(16).result || row.getCell(16).result==0  ? row.getCell(16).result : ''  : row.getCell(16).value ? row.getCell(16).value : '';

                          sql += "','";
                          value = row.getCell(17).formula;
                          sql += value ? (row.getCell(17).result != '') || row.getCell(17).result || row.getCell(17).result==0  ? row.getCell(17).result.toFixed(6) : ''  : row.getCell(17).value ? row.getCell(17).value : '';

                          sql += "','";
                          value = row.getCell(18).formula;
                          sql += value ? (row.getCell(18).result != '') || row.getCell(18).result || row.getCell(18).result==0  ? row.getCell(18).result : ''  : row.getCell(18).value ? row.getCell(18).value : '';

                          sql += "','";
                          value = row.getCell(19).formula;
                          sql += value ? (row.getCell(19).result != '') || row.getCell(19).result || row.getCell(19).result==0  ? row.getCell(19).result : ''  : row.getCell(19).value ? row.getCell(19).value : '';

                          sql += "','";
                          value = row.getCell(20).formula;
                          sql += value ? (row.getCell(20).result != '') || row.getCell(20).result || row.getCell20.result==0  ? row.getCell(20).result : ''  : row.getCell(20).value ? row.getCell(20).value : '';

                          sql += "','";
                          value = row.getCell(21).formula;
                          sql += value ? (row.getCell(21).result != '') || row.getCell(21).result || row.getCell(21).result==0  ? row.getCell(21).result : ''  : row.getCell(21).value ? row.getCell(21).value : '';

                          sql += "','";
                          value = row.getCell(22).formula;
                          sql += value ? (row.getCell(22).result != '') || row.getCell(22).result || row.getCell(22).result==0  ? row.getCell(22).result : ''  : row.getCell(22).value ? row.getCell(22).value : '';

                          sql += "','";
                          value = row.getCell(23).formula;
                          sql += value ? (row.getCell(23).result != '') || row.getCell(23).result || row.getCell(23).result==0  ? row.getCell(23).result : ''  : row.getCell(23).value ? row.getCell(23).value : '';

                          sql += "','";
                          value = row.getCell(24).formula;
                          sql += value ? (row.getCell(24).result != '') || row.getCell(24).result || row.getCell(24).result==0  ? row.getCell(24).result.toFixed(2)  : ''  : row.getCell(24).value ? row.getCell(24).value : '';

                          sql += "','";
                          value = row.getCell(25).formula;
                          sql += value ? (row.getCell(25).result != '') || row.getCell(25).result || row.getCell(25).result==0  ? row.getCell(25).result.toFixed(2) : ''  : row.getCell(25).value ? row.getCell(25).value : '';

                          sql += "','";
                          value = row.getCell(26).formula;
                          sql += value ? (row.getCell(26).result != '') || row.getCell(26).result || row.getCell(26).result==0  ? row.getCell(26).result : ''  : row.getCell(26).value ? row.getCell(26).value : '';

                          sql += "','";
                          value = row.getCell(27).formula;
                          sql += value ? (row.getCell(27).result != '') || row.getCell(27).result || row.getCell(27).result==0  ? row.getCell(27).result : ''  : row.getCell(27).value ? row.getCell(27).value : '';

                          sql += "','";
                          value = row.getCell(28).formula;
                          sql += value ? (row.getCell(28).result != '') || row.getCell(28).result || row.getCell(28).result==0  ? row.getCell(28).result : ''  : row.getCell(28).value ? row.getCell(28).value : '';

                          sql += "','";
                          value = row.getCell(29).formula;
                          sql += value ? (row.getCell(29).result != '') || row.getCell(29).result || row.getCell(29).result==0  ? row.getCell(29).result : ''  : row.getCell(29).value ? row.getCell(29).value : '';

                          sql += "','";
                          value = row.getCell(30).formula;
                          sql += value ? (row.getCell(30).result != '') || row.getCell(30).result || row.getCell(30).result==0  ? row.getCell(30).result : ''  : row.getCell(30).value ? row.getCell(30).value : '';

                          sql += "','";
                          value = row.getCell(31).formula;
                          sql += value ? (row.getCell(31).result != '') || row.getCell(31).result || row.getCell(31).result==0  ? row.getCell(31).result : ''  : row.getCell(31).value ? row.getCell(31).value : '';

                          sql += "')";
                          console.log(sql);
                          console.log("---");
                          db.query(sql);
                       });
        }
     });
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write
                    (
                     JSON.stringify
                     (
                      {
                       "status":true,
                       "upload_excel":
                        {
                         "result": "pass",
                         "oldpath": oldpath,
                         "newpath": newpath
                        }
                       }
                     )
                    );
                    res.end();
     });
//               res.writeHead(200, {'Content-Type': 'application/json'});
//               res.write
//               (
//                JSON.stringify
//                (
//                 {
//                  "status":true,
//                  "upload_excel":
//                   {
//                    "result": "pass",
//                    "oldpath": "test",
//                    "newpath": "test"
//                   }
//                  }
//                )
//               );
//               res.end();
});
*/



app.post("/master_data/upload", async (req, res) => {
    const db = require('./db');
    //db.start();
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath =  'uploaded_files/myupload.xlsx';
     fs.rename(oldpath, newpath, async function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
                    const content = await wb.xlsx.readFile(newpath);
                    const worksheet = content.worksheets[0];
                    const rowStartIndex = 5;
                    const numberOfRows = worksheet.rowCount - 4;
                    const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
                    row_cnt=0;

                    //const newList = await Promise.all(
                    //await Promise.all(

                    //await Promise.all(
                     //rows.map(async (row) => {})
                    //);

                    //fs.writeFile('/uploaded_files/temp.txt', 'start', { flag: 'w+' }, err => {});
                    fs.writeFileSync('uploaded_files/temp.txt', 'start'+'\r\n');

                    rows.map(async (row) => {

                          row_cnt++;
                          console.log("row="+row_cnt);

                          sql="insert into master_tsubakimoto(category,part_no,previous_model_no,new_model_no,unit,manufacturer_suggested_retail_price,new_manufacturer_suggested_retail_price,conversion_to_ft,diff_for_cost,op_price,po_price_jpy_usd,po_price_currency,remark,thb_cost,gp,pricelist_name,multiplier,make_same_price_as_standard_price,new_make_same_price_as_standard_price,standard_price,diff,dist_pl_mull,dist_ex_rate,unit_price,new_unit_price,diff_unit_price,status,supplier_name,stock_reference,cutting_assembly,detail)";
                          sql += " values ('";
                          value = row.getCell(1).formula;



                          sql += value ? (row.getCell(1).result != '') || row.getCell(1).result || row.getCell(1).result==0 ? row.getCell(1).result : ''  : row.getCell(1).value ? row.getCell(1).value : '';

                          sql += "','";
                          value = row.getCell(2).formula;
                          sql += value ? (row.getCell(2).result != '') || row.getCell(2).result || row.getCell(2).result==0  ? row.getCell(2).result : ''  : row.getCell(2).value ? row.getCell(2).value : '';

                          sql += "','";
                          value = row.getCell(3).formula;
                          sql += value ? (row.getCell(3).result != '') || row.getCell(3).result || row.getCell(3).result==0  ? row.getCell(3).result : ''  : row.getCell(3).value ? row.getCell(3).value : '';

                          sql += "','";
                          value = row.getCell(4).formula;
                          sql += value ? (row.getCell(4).result != '') || row.getCell(4).result || row.getCell(4).result==0  ? row.getCell(4).result : ''  : row.getCell(4).value ? row.getCell(4).value : '';

                          sql += "','";
                          value = row.getCell(5).formula;
                          sql += value ? (row.getCell(5).result != '') || row.getCell(5).result || row.getCell(5).result==0  ? row.getCell(5).result : ''  : row.getCell(5).value ? row.getCell(5).value : '';

                          sql += "','";
                          value = row.getCell(6).formula;
                          sql += value ? (row.getCell(6).result != '') || row.getCell(6).result || row.getCell(6).result==0  ? row.getCell(6).result : ''  : row.getCell(6).value ? row.getCell(6).value : '';

                          sql += "','";
                          value = row.getCell(7).formula;
                          sql += value ? (row.getCell(7).result != '')  || row.getCell(7).result || row.getCell(7).result==0 ? row.getCell(7).result : ''  : row.getCell(7).value ? row.getCell(7).value : '';

                          sql += "','";
                          value = row.getCell(8).formula;
                          sql += value ? (row.getCell(8).result != '')  || row.getCell(8).result || row.getCell(8).result==0  ? row.getCell(8).result : ''  : row.getCell(8).value ? row.getCell(8).value : '';

                          sql += "','";
                          value = row.getCell(9).formula;
                          sql += value ? (row.getCell(9).result != '')  || row.getCell(9).result || row.getCell(9).result==0  ? row.getCell(9).result : ''  : row.getCell(9).value ? row.getCell(9).value : '';

                          sql += "','";
                          value = row.getCell(10).formula;
                          sql += value ? (row.getCell(10).result != '') || row.getCell(10).result || row.getCell(10).result==0 ? row.getCell(10).result : ''  : row.getCell(10).value ? row.getCell(10).value : '';

                          sql += "','";
                          value = row.getCell(11).formula;
                          sql += value ? (row.getCell(11).result != '') || row.getCell(11).result || row.getCell(11).result==0  ? row.getCell(11).result : ''  : row.getCell(11).value ? row.getCell(11).value : '';

                          sql += "','";
                          value = row.getCell(12).formula;
                          sql += value ? (row.getCell(12).result != '') || row.getCell(12).result || row.getCell(12).result==0  ? row.getCell(12).result : ''  : row.getCell(12).value ? row.getCell(12).value : '';

                          sql += "','";
                          value = row.getCell(13).formula;
                          sql += value ? (row.getCell(13).result != '') || row.getCell(13).result || row.getCell(13).result==0  ? row.getCell(13).result : ''  : row.getCell(13).value ? row.getCell(13).value : '';

                          sql += "','";
                          value = row.getCell(14).formula;

                                                    if (value)
                                                    {
                                                    str = row.getCell(14).result.toFixed(6).toString();
                                                    mystr = new Array();
                                                    console.log("output string="+str);
                                                    cnt = -1;
                                                    for (let i = 0; i < str.length; i++) {
                                                     if (str[i] == '.')
                                                      {
                                                       console.log(str[i]+"<-");
                                                       cnt = 0;
                                                       mystr.push(str[i]);
                                                      }
                                                     else
                                                      {
                                                       if (cnt >= 0)
                                                        {
                                                         cnt = cnt + 1;
                                                         console.log(str[i]+"-#"+cnt);
                                                         if (cnt==6)
                                                          {
                                                           if (parseInt(str[i]) >= 5)
                                                            {
                                                             mystr[i-1] = ((parseInt(str[i-1])+1).toString());
                                                            }
                                                           //else
                                                            //mystr.push(str[i]);
                                                          }
                                                         else
                                                          mystr.push(str[i]);
                                                        }
                                                       else
                                                        {
                                                         console.log(str[i]);
                                                         mystr.push(str[i]);
                                                        }
                                                      }
                                                     }
                                                    mystr = mystr.join('');
                                                    console.log("output string="+mystr.toString());
                                                    }

                          //sql += value ? (row.getCell(14).result != '') || row.getCell(14).result || row.getCell(14).result==0  ? row.getCell(14).result.toFixed(5) : ''  : row.getCell(14).value ? row.getCell(14).value : '';
                          sql += value ? (row.getCell(14).result != '') || row.getCell(14).result || row.getCell(14).result==0  ? mystr.toString() : ''  : row.getCell(14).value ? row.getCell(14).value : '';


                          sql += "','";
                          value = row.getCell(15).formula;


                                                                              if (value)
                                                                              {
                                                                              str = row.getCell(15).result.toFixed(7).toString();
                                                                              mystr = new Array();
                                                                              console.log("output string="+str);
                                                                              cnt = -1;
                                                                              for (let i = 0; i < str.length; i++) {
                                                                               if (str[i] == '.')
                                                                                {
                                                                                 console.log(str[i]+"<-");
                                                                                 cnt = 0;
                                                                                 mystr.push(str[i]);
                                                                                }
                                                                               else
                                                                                {
                                                                                 if (cnt >= 0)
                                                                                  {
                                                                                   cnt = cnt + 1;
                                                                                   console.log(str[i]+"-#"+cnt);
                                                                                   if (cnt==7)
                                                                                    {
                                                                                     if (parseInt(str[i]) >= 5)
                                                                                      {
                                                                                       mystr[i-1] = ((parseInt(str[i-1])+1).toString());
                                                                                      }
                                                                                     //else
                                                                                      //mystr.push(str[i]);
                                                                                    }
                                                                                   else
                                                                                    mystr.push(str[i]);
                                                                                  }
                                                                                 else
                                                                                  {
                                                                                   console.log(str[i]);
                                                                                   mystr.push(str[i]);
                                                                                  }
                                                                                }
                                                                               }
                                                                              mystr = mystr.join('');
                                                                              console.log("output string="+mystr.toString());
                                                                              }

                          //sql += value ? (row.getCell(15).result != '') || row.getCell(15).result || row.getCell(15).result==0  ? row.getCell(15).result.toFixed(6)  : ''  : row.getCell(15).value ? row.getCell(15).value : '';
                          sql += value ? (row.getCell(15).result != '') || row.getCell(15).result || row.getCell(15).result==0  ? mystr.toString()  : ''  : row.getCell(15).value ? row.getCell(15).value : '';


                          sql += "','";
                          value = row.getCell(16).formula;
                          sql += value ? (row.getCell(16).result != '') || row.getCell(16).result || row.getCell(16).result==0  ? row.getCell(16).result : ''  : row.getCell(16).value ? row.getCell(16).value : '';

                          sql += "','";
                          value = row.getCell(17).formula;

                                                                                                        if (value)
                                                                                                        {
                                                                                                        str = row.getCell(17).result.toFixed(7).toString();
                                                                                                        mystr = new Array();
                                                                                                        console.log("output string="+str);
                                                                                                        cnt = -1;
                                                                                                        for (let i = 0; i < str.length; i++) {
                                                                                                         if (str[i] == '.')
                                                                                                          {
                                                                                                           console.log(str[i]+"<-");
                                                                                                           cnt = 0;
                                                                                                           mystr.push(str[i]);
                                                                                                          }
                                                                                                         else
                                                                                                          {
                                                                                                           if (cnt >= 0)
                                                                                                            {
                                                                                                             cnt = cnt + 1;
                                                                                                             console.log(str[i]+"-#"+cnt);
                                                                                                             if (cnt==7)
                                                                                                              {
                                                                                                               if (parseInt(str[i]) >= 5)
                                                                                                                {
                                                                                                                 mystr[i-1] = ((parseInt(str[i-1])+1).toString());
                                                                                                                }
                                                                                                               //else
                                                                                                                //mystr.push(str[i]);
                                                                                                              }
                                                                                                             else
                                                                                                              mystr.push(str[i]);
                                                                                                            }
                                                                                                           else
                                                                                                            {
                                                                                                             console.log(str[i]);
                                                                                                             mystr.push(str[i]);
                                                                                                            }
                                                                                                          }
                                                                                                         }
                                                                                                        mystr = mystr.join('');
                                                                                                        console.log("output string="+mystr.toString());
                                                                                                        }


                          //sql += value ? (row.getCell(17).result != '') || row.getCell(17).result || row.getCell(17).result==0  ? row.getCell(17).result.toFixed(6) : ''  : row.getCell(17).value ? row.getCell(17).value : '';
                          sql += value ? (row.getCell(17).result != '') || row.getCell(17).result || row.getCell(17).result==0  ? mystr.toString() : ''  : row.getCell(17).value ? row.getCell(17).value : '';


                          sql += "','";
                          value = row.getCell(18).formula;
                          sql += value ? (row.getCell(18).result != '') || row.getCell(18).result || row.getCell(18).result==0  ? row.getCell(18).result : ''  : row.getCell(18).value ? row.getCell(18).value : '';

                          sql += "','";
                          value = row.getCell(19).formula;
                          sql += value ? (row.getCell(19).result != '') || row.getCell(19).result || row.getCell(19).result==0  ? row.getCell(19).result : ''  : row.getCell(19).value ? row.getCell(19).value : '';

                          sql += "','";
                          value = row.getCell(20).formula;
                          sql += value ? (row.getCell(20).result != '') || row.getCell(20).result || row.getCell20.result==0  ? row.getCell(20).result : ''  : row.getCell(20).value ? row.getCell(20).value : '';

                          sql += "','";
                          value = row.getCell(21).formula;
                          sql += value ? (row.getCell(21).result != '') || row.getCell(21).result || row.getCell(21).result==0  ? row.getCell(21).result : ''  : row.getCell(21).value ? row.getCell(21).value : '';

                          sql += "','";
                          value = row.getCell(22).formula;
                          sql += value ? (row.getCell(22).result != '') || row.getCell(22).result || row.getCell(22).result==0  ? row.getCell(22).result : ''  : row.getCell(22).value ? row.getCell(22).value : '';

                          sql += "','";
                          value = row.getCell(23).formula;
                          sql += value ? (row.getCell(23).result != '') || row.getCell(23).result || row.getCell(23).result==0  ? row.getCell(23).result : ''  : row.getCell(23).value ? row.getCell(23).value : '';

                          sql += "','";
                          value = row.getCell(24).formula;

                          if (value)
                          {
                          str = row.getCell(24).result.toFixed(3).toString();
                          mystr = new Array();
                          console.log("output string="+str);
                          cnt = -1;
                          for (let i = 0; i < str.length; i++) {
                           if (str[i] == '.')
                           {
                            console.log(str[i]+"<-");
                            cnt = 0;
                            mystr.push(str[i]);
                           }
                           else
                           {
                            if (cnt >= 0)
                            {
                             cnt = cnt + 1;
                             console.log(str[i]+"-#"+cnt);
                             if (cnt==3)
                              {
                               if (parseInt(str[i]) >= 5)
                                {
                                 mystr[i-1] = ((parseInt(str[i-1])+1).toString());
                                }
                               else
                                mystr.push(str[i]);
                              }
                              else
                               mystr.push(str[i]);
                            }
                            else
                            {
                             console.log(str[i]);
                             mystr.push(str[i]);
                            }
                           }
                           }
                          mystr = mystr.join('');
                          console.log("output string="+mystr.toString());
                          }

                          //sql += value ? (row.getCell(24).result != '') || row.getCell(24).result || row.getCell(24).result==0  ? row.getCell(24).result.toFixed(2)  : ''  : row.getCell(24).value ? row.getCell(24).value : '';
                          sql += value ? (row.getCell(24).result != '') || row.getCell(24).result || row.getCell(24).result==0  ? mystr.toString()  : ''  : row.getCell(24).value ? row.getCell(24).value : '';


                          sql += "','";
                          value = row.getCell(25).formula;
                          if (value)
                          {
                          str = row.getCell(25).result.toFixed(3).toString();
                          mystr = new Array();
                          console.log("output string="+str);
                          cnt = -1;
                          for (let i = 0; i < str.length; i++) {
                           if (str[i] == '.')
                            {
                             console.log(str[i]+"<-");
                             cnt = 0;
                             mystr.push(str[i]);
                            }
                           else
                            {
                             if (cnt >= 0)
                              {
                               cnt = cnt + 1;
                               console.log(str[i]+"-#"+cnt);
                               if (cnt==3)
                                {
                                 if (parseInt(str[i]) >= 5)
                                  {
                                   mystr[i-1] = ((parseInt(str[i-1])+1).toString());
                                  }
                                 else
                                  mystr.push(str[i]);
                                }
                               else
                                mystr.push(str[i]);
                              }
                             else
                              {
                               console.log(str[i]);
                               mystr.push(str[i]);
                              }
                            }
                           }
                          mystr = mystr.join('');
                          console.log("output string="+mystr.toString());
                          }
                          //sql += value ? (row.getCell(25).result != '') || row.getCell(25).result || row.getCell(25).result==0  ? row.getCell(25).result.toFixed(2) : ''  : row.getCell(25).value ? row.getCell(25).value : '';
                          sql += value ? (row.getCell(25).result != '') || row.getCell(25).result || row.getCell(25).result==0  ? mystr.toString() : ''  : row.getCell(25).value ? row.getCell(25).value : '';

                          sql += "','";
                          value = row.getCell(26).formula;
                          sql += value ? (row.getCell(26).result != '') || row.getCell(26).result || row.getCell(26).result==0  ? row.getCell(26).result : ''  : row.getCell(26).value ? row.getCell(26).value : '';

                          sql += "','";
                          value = row.getCell(27).formula;
                          sql += value ? (row.getCell(27).result != '') || row.getCell(27).result || row.getCell(27).result==0  ? row.getCell(27).result : ''  : row.getCell(27).value ? row.getCell(27).value : '';

                          sql += "','";
                          value = row.getCell(28).formula;
                          sql += value ? (row.getCell(28).result != '') || row.getCell(28).result || row.getCell(28).result==0  ? row.getCell(28).result : ''  : row.getCell(28).value ? row.getCell(28).value : '';

                          sql += "','";
                          value = row.getCell(29).formula;
                          sql += value ? (row.getCell(29).result != '') || row.getCell(29).result || row.getCell(29).result==0  ? row.getCell(29).result : ''  : row.getCell(29).value ? row.getCell(29).value : '';

                          sql += "','";
                          value = row.getCell(30).formula;
                          sql += value ? (row.getCell(30).result != '') || row.getCell(30).result || row.getCell(30).result==0  ? row.getCell(30).result : ''  : row.getCell(30).value ? row.getCell(30).value : '';

                          sql += "','";
                          value = row.getCell(31).formula;
                          sql += value ? (row.getCell(31).result != '') || row.getCell(31).result || row.getCell(31).result==0  ? row.getCell(31).result : ''  : row.getCell(31).value ? row.getCell(31).value : '';

                          sql += "')";
                          console.log(sql);
                          console.log("---");

                          //write to file
                          //fs.writeFileSync('/uploaded_files/temp.txt', sql);
                          fs.writeFile('uploaded_files/temp.txt', sql+'\r\n', { flag: 'a+' }, err => {});


                          //await db.query(sql);
                       })

                       line_cnt = 0;
                       lineReader.eachLine('uploaded_files/temp.txt', async function(line, last) {
                         line_cnt++;
                         if (line_cnt > 1)
                          {
                           sql = line.replace("\r\n", "");
                           console.log("count sql#"+line_cnt+"->execute sql:"+sql)
                           //sql = line.replace("\r\n", "");
                           await db.query(sql);
                          }
                       });

                     //);







        }
     });
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write
                    (
                     JSON.stringify
                     (
                      {
                       "status":true,
                       "upload_excel":
                        {
                         "result": "pass",
                         "oldpath": oldpath,
                         "newpath": newpath
                        }
                       }
                     )
                    );
                    res.end();
     });
     //db.end();
});









app.post("/master_data/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into master_tsubakimoto";
    sql += "(category,";
    sql += "part_no,";
    sql += "previous_model_no,";
    sql += "new_model_no,";
    sql += "unit,";
    sql += "manufacturer_suggested_retail_price,";
    sql += "new_manufacturer_suggested_retail_price,";
    sql += "conversion_to_ft,";
    sql += "diff_for_cost,";
    sql += "op_price,";
    sql += "po_price_jpy_usd,";
    sql += "po_price_currency,";
    sql += "remark,";
    sql += "thb_cost,";
    sql += "gp,";
    sql += "pricelist_name,";
    sql += "multiplier,";
    sql += "make_same_price_as_standard_price,";
    sql += "new_make_same_price_as_standard_price,";
    sql += "standard_price,";
    sql += "diff,";
    sql += "dist_pl_mull,";
    sql += "dist_ex_rate,";
    sql += "unit_price,";
    sql += "new_unit_price,";
    sql += "diff_unit_price,";
    sql += "status,";
    sql += "supplier_name,";
    sql += "stock_reference,";
    sql += "cutting_assembly,";
    sql += "detail)";
    sql += " values ('";
    sql += req.body.category;
    sql += "','";
    sql += req.body.part_no;
    sql += "','";
    sql += req.body.previous_model_no;
    sql += "','";
    sql += req.body.new_model_no;
    sql += "','";
    sql += req.body.unit;
    sql += "','";
    sql += req.body.manufacturer_suggested_retail_price;
    sql += "','";
    sql += req.body.new_manufacturer_suggested_retail_price;
    sql += "','";
    sql += req.body.conversion_to_ft;
    sql += "','";
    sql += req.body.diff_for_cost;
    sql += "','";
    sql += req.body.op_price;
    sql += "','";
    sql += req.body.po_price_jpy_usd;
    sql += "','";
    sql += req.body.po_price_currency;
    sql += "','";
    sql += req.body.remark;
    sql += "','";
    sql += req.body.thb_cost;
    sql += "','";
    sql += req.body.gp;
    sql += "','";
    sql += req.body.pricelist_name;
    sql += "','";
    sql += req.body.multiplier;
    sql += "','";
    sql += req.body.make_same_price_as_standard_price;
    sql += "','";
    sql += req.body.new_make_same_price_as_standard_price;
    sql += "','";
    sql += req.body.standard_price;
    sql += "','";
    sql += req.body.diff;
    sql += "','";
    sql += req.body.dist_pl_mull;
    sql += "','";
    sql += req.body.dist_ex_rate;
    sql += "','";
    sql += req.body.unit_price;
    sql += "','";
    sql += req.body.new_unit_price;
    sql += "','";
    sql += req.body.diff_unit_price;
    sql += "','";
    sql += req.body.status;
    sql += "','";
    sql += req.body.supplier_name;
    sql += "','";
    sql += req.body.stock_reference;
    sql += "','";
    sql += req.body.cutting_assembly;
    sql += "','";
    sql += req.body.detail;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_master_table":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();


});


app.post("/master_data/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update master_tsubakimoto set ";
    sql += "category='";
    sql += req.body.category;
    sql += "',";
    sql += "part_no='";
    sql += req.body.part_no;
    sql += "',";
    sql += "previous_model_no='";
    sql += req.body.previous_model_no;
    sql += "',";
    sql += "new_model_no='";
    sql += req.body.new_model_no;
    sql += "',";
    sql += "unit='";
    sql += req.body.unit;
    sql += "',";
    sql += "manufacturer_suggested_retail_price='";
    sql += req.body.manufacturer_suggested_retail_price;
    sql += "',";
    sql += "new_manufacturer_suggested_retail_price='";
    sql += req.body.new_manufacturer_suggested_retail_price;
    sql += "',";
    sql += "conversion_to_ft='";
    sql += req.body.conversion_to_ft;
    sql += "',";
    sql += "diff_for_cost='";
    sql += req.body.diff_for_cost;
    sql += "',";
    sql += "op_price='";
    sql += req.body.op_price;
    sql += "',";
    sql += "po_price_jpy_usd='";
    sql += req.body.po_price_jpy_usd;
    sql += "',";
    sql += "po_price_currency='";
    sql += req.body.po_price_currency;
    sql += "',";
    sql += "remark='";
    sql += req.body.remark;
    sql += "',";
    sql += "thb_cost='";
    sql += req.body.thb_cost;
    sql += "',";
    sql += "gp='";
    sql += req.body.gp;
    sql += "',";
    sql += "pricelist_name='";
    sql += req.body.pricelist_name;
    sql += "',";
    sql += "multiplier='";
    sql += req.body.multiplier;
    sql += "',";
    sql += "make_same_price_as_standard_price='";
    sql += req.body.make_same_price_as_standard_price;
    sql += "',";
    sql += "new_make_same_price_as_standard_price='";
    sql += req.body.new_make_same_price_as_standard_price;
    sql += "',";
    sql += "standard_price='";
    sql += req.body.standard_price;
    sql += "',";
    sql += "diff='";
    sql += req.body.diff;
    sql += "',";
    sql += "dist_pl_mull='";
    sql += req.body.dist_pl_mull;
    sql += "',";
    sql += "dist_ex_rate='";
    sql += req.body.dist_ex_rate;
    sql += "',";
    sql += "unit_price='";
    sql += req.body.unit_price;
    sql += "',";
    sql += "new_unit_price='";
    sql += req.body.new_unit_price;
    sql += "',";
    sql += "diff_unit_price='";
    sql += req.body.diff_unit_price;
    sql += "',";
    sql += "status='";
    sql += req.body.status;
    sql += "',";
    sql += "supplier_name='";
    sql += req.body.supplier_name;
    sql += "',";
    sql += "stock_reference='";
    sql += req.body.stock_reference;
    sql += "',";
    sql += "cutting_assembly='";
    sql += req.body.cutting_assembly;
    sql += "',";
    sql += "detail='";
    sql += req.body.detail;
    sql += "' where Id=";
    sql += req.body.Id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_master_table":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();


});






app.post("/master_formula/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from master_tsubakimoto_formula";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/master_formula/deleteall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "delete from master_tsubakimoto_formula";
 console.log(sql);
 await db.query(sql);
 res.writeHead(200, {'Content-Type': 'application/json'});
 res.write
 (
         JSON.stringify
         (
              {
                 "status":true,
                 "deleteall":
                  {
                    "table": "master_formula",
                    "result": "pass"
                  }
              }
         )
 );
 res.end();
});

app.post("/master_formula/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from master_tsubakimoto_formula where ";
    sql += "Id=";
    sql += req.body.Id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from master_formula":
                  {
                   "result": "pass",
                   "id": req.body.Id
                  }
                 }
               )
              );
    res.end();
});

//app.post("/master_formula/upload", async (req, res) => {
//    const db = require('./db');
//    const config = require('./config');
//    const helper = require('./helper');
//    var form = new formidable.IncomingForm();
//    form.parse(req, function (err, fields, files) {
//     console.log(files);
//     var oldpath = files.formula[0].filepath;
//     var newpath =  'uploaded_files/myupload.xlsx';
//     fs.rename(oldpath, newpath, async function (err) {
//       if (err)
//       {
//         res.writeHead(200, {'Content-Type': 'application/json'});
//         res.write
//         (
//          JSON.stringify
//           (
//            {
//             "status":true,
//             "upload_excel":
//              {
//               "result": "fail",
//               "oldpath": oldpath,
//               "newpath": newpath
//              }
//             }
//           )
//          );
//          res.end();
//       }
//       else
//       {
//          var wb = new Excel.Workbook();
//          const content = await wb.xlsx.readFile(newpath);
//          const worksheet = content.worksheets[0];
//          const rowStartIndex = 4;
//          const numberOfRows = worksheet.rowCount - 4;
//          const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
//          rows.map((row) => {
//                sql="insert into master_tsubakimoto_formula(category,part_no,previous_model_no,new_model_no,unit,manufacturer_suggested_retail_price,new_manufacturer_suggested_retail_price,conversion_to_ft,diff_for_cost,op_price,po_price_jpy_usd,po_price_currency,remark,thb_cost,gp,pricelist_name,multiplier,make_same_price_as_standard_price,new_make_same_price_as_standard_price,standard_price,diff,dist_pl_mull,dist_ex_rate,unit_price,new_unit_price,diff_unit_price,status,supplier_name,stock_reference,cutting_assembly,detail)";
//                sql += " values ('";
//                value = row.getCell(0).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(1).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(2).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(3).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(4).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(5).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(6).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(7).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(8).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(9).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(10).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(11).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(12).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(13).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(14).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(15).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(16).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(17).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(18).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(19).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(20).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(21).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(22).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(23).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(24).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(25).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(26).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(27).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(28).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(29).value;
//                sql += value.toString();
//
//                sql += "','";
//                value = row.getCell(30).value;
//                sql += value.toString();
//
//                sql += "')";
//                console.log(sql);
//                db.query(sql);
//             });
//            }
//          });
//          });
//          res.writeHead(200, {'Content-Type': 'application/json'});
//          res.write
//          (
//           JSON.stringify
//           (
//            {
//             "status":true,
//             "upload_excel":
//              {
//               "result": "pass",
//               "oldpath": "test",
//               "newpath": "test"
//              }
//             }
//           )
//          );
//          res.end();
//         });


app.post("/master_formula/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath =  'uploaded_files/myupload.xlsx';
     fs.rename(oldpath, newpath, async function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
                    const content = await wb.xlsx.readFile(newpath);
                    const worksheet = content.worksheets[0];
                    const rowStartIndex = 5;
                    const numberOfRows = worksheet.rowCount - 4;
                    const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
                    rows.map((row) => {
                          sql="insert into master_tsubakimoto_formula(category,part_no,previous_model_no,new_model_no,unit,manufacturer_suggested_retail_price,new_manufacturer_suggested_retail_price,conversion_to_ft,diff_for_cost,op_price,po_price_jpy_usd,po_price_currency,remark,thb_cost,gp,pricelist_name,multiplier,make_same_price_as_standard_price,new_make_same_price_as_standard_price,standard_price,diff,dist_pl_mull,dist_ex_rate,unit_price,new_unit_price,diff_unit_price,status,supplier_name,stock_reference,cutting_assembly,detail)";
                          sql += " values ('";
                          value = row.getCell(1).formula;
                          sql += value ? value.toString() : row.getCell(1).value ? row.getCell(1).value : '';

                          sql += "','";
                          value = row.getCell(2).formula;
                          sql += value ? value.toString() : row.getCell(2).value ? row.getCell(2).value : '';

                          sql += "','";
                          value = row.getCell(3).formula;
                          sql += value ? value.toString() : row.getCell(3).value ? row.getCell(3).value : '';

                          sql += "','";
                          value = row.getCell(4).formula;
                          sql += value ? value.toString() : row.getCell(4).value ? row.getCell(4).value : '';

                          sql += "','";
                          value = row.getCell(5).formula;
                          sql += value ? value.toString() : row.getCell(5).value ? row.getCell(5).value : '';

                          sql += "','";
                          value = row.getCell(6).formula;
                          sql += value ? value.toString() : row.getCell(6).value ? row.getCell(6).value : '';

                          sql += "','";
                          value = row.getCell(7).formula;
                          sql += value ? value.toString() : row.getCell(7).value ? row.getCell(7).value : '';

                          sql += "','";
                          value = row.getCell(8).formula;
                          sql += value ? value.toString() : row.getCell(8).value ? row.getCell(8).value : '';

                          sql += "','";
                          value = row.getCell(9).formula;
                          sql += value ? value.toString() : row.getCell(9).value ? row.getCell(9).value : '';

                          sql += "','";
                          value = row.getCell(10).formula;
                          sql += value ? value.toString() : row.getCell(10).value ? row.getCell(10).value : '';

                          sql += "','";
                          value = row.getCell(11).formula;
                          sql += value ? value.toString() : row.getCell(11).value ? row.getCell(11).value : '';

                          sql += "','";
                          value = row.getCell(12).formula;
                          sql += value ? value.toString() : row.getCell(12).value ? row.getCell(12).value : '';

                          sql += "','";
                          value = row.getCell(13).formula;
                          sql += value ? value.toString() : row.getCell(13).value ? row.getCell(13).value : '';

                          sql += "','";
                          value = row.getCell(14).formula;
                          sql += value ? value.toString() : row.getCell(14).value ? row.getCell(14).value : '';

                          sql += "','";
                          value = row.getCell(15).formula;
                          sql += value ? value.toString() : row.getCell(15).value ? row.getCell(15).value : '';

                          sql += "','";
                          value = row.getCell(16).formula;
                          sql += value ? value.toString() : row.getCell(16).value ? row.getCell(16).value : '';

                          sql += "','";
                          value = row.getCell(17).formula;
                          sql += value ? value.toString() : row.getCell(17).value ? row.getCell(17).value : '';

                          sql += "','";
                          value = row.getCell(18).formula;
                          sql += value ? value.toString() : row.getCell(18).value ? row.getCell(18).value : '';

                          sql += "','";
                          value = row.getCell(19).formula;
                          sql += value ? value.toString() : row.getCell(19).value ? row.getCell(19).value : '';

                          sql += "','";
                          value = row.getCell(20).formula;
                          sql += value ? value.toString() : row.getCell(20).value ? row.getCell(20).value : '';

                          sql += "','";
                          value = row.getCell(21).formula;
                          sql += value ? value.toString() : row.getCell(21).value ? row.getCell(21).value : '';

                          sql += "','";
                          value = row.getCell(22).formula;
                          sql += value ? value.toString() : row.getCell(22).value ? row.getCell(22).value : '';

                          sql += "','";
                          value = row.getCell(23).formula;
                          sql += value ? value.toString() : row.getCell(23).value ? row.getCell(23).value : '';

                          sql += "','";
                          value = row.getCell(24).formula;
                          sql += value ? value.toString() : row.getCell(24).value ? row.getCell(24).value : '';

                          sql += "','";
                          value = row.getCell(25).formula;
                          sql += value ? value.toString() : row.getCell(25).value ? row.getCell(25).value : '';

                          sql += "','";
                          value = row.getCell(26).formula;
                          sql += value ? value.toString() : row.getCell(26).value ? row.getCell(26).value : '';

                          sql += "','";
                          value = row.getCell(27).formula;
                          sql += value ? value.toString() : row.getCell(27).value ? row.getCell(27).value : '';

                          sql += "','";
                          value = row.getCell(28).formula;
                          sql += value ? value.toString() : row.getCell(28).value ? row.getCell(28).value : '';

                          sql += "','";
                          value = row.getCell(29).formula;
                          sql += value ? value.toString() : row.getCell(29).value ? row.getCell(29).value : '';

                          sql += "','";
                          value = row.getCell(30).formula;
                          sql += value ? value.toString() : row.getCell(30).value ? row.getCell(30).value : '';

                          sql += "','";
                          value = row.getCell(31).formula;
                          sql += value ? value.toString() : row.getCell(31).value ? row.getCell(31).value : '';

                          sql += "')";
                          console.log(sql);
                          console.log("---");
                          db.query(sql);
                       });
        }
     });
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write
                    (
                     JSON.stringify
                     (
                      {
                       "status":true,
                       "upload_excel":
                        {
                         "result": "pass",
                         "oldpath": oldpath,
                         "newpath": newpath
                        }
                       }
                     )
                    );
                    res.end();
     });
//               res.writeHead(200, {'Content-Type': 'application/json'});
//               res.write
//               (
//                JSON.stringify
//                (
//                 {
//                  "status":true,
//                  "upload_excel":
//                   {
//                    "result": "pass",
//                    "oldpath": "test",
//                    "newpath": "test"
//                   }
//                  }
//                )
//               );
//               res.end();
});


app.post("/master_formula/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into master_tsubakimoto_formula";
    sql += "(category,";
    sql += "part_no,";
    sql += "previous_model_no,";
    sql += "new_model_no,";
    sql += "unit,";
    sql += "manufacturer_suggested_retail_price,";
    sql += "new_manufacturer_suggested_retail_price,";
    sql += "conversion_to_ft,";
    sql += "diff_for_cost,";
    sql += "op_price,";
    sql += "po_price_jpy_usd,";
    sql += "po_price_currency,";
    sql += "remark,";
    sql += "thb_cost,";
    sql += "gp,";
    sql += "pricelist_name,";
    sql += "multiplier,";
    sql += "make_same_price_as_standard_price,";
    sql += "new_make_same_price_as_standard_price,";
    sql += "standard_price,";
    sql += "diff,";
    sql += "dist_pl_mull,";
    sql += "dist_ex_rate,";
    sql += "unit_price,";
    sql += "new_unit_price,";
    sql += "diff_unit_price,";
    sql += "status,";
    sql += "supplier_name,";
    sql += "stock_reference,";
    sql += "cutting_assembly,";
    sql += "detail)";
    sql += " values ('";
    sql += req.body.category;
    sql += "','";
    sql += req.body.part_no;
    sql += "','";
    sql += req.body.previous_model_no;
    sql += "','";
    sql += req.body.new_model_no;
    sql += "','";
    sql += req.body.unit;
    sql += "','";
    sql += req.body.manufacturer_suggested_retail_price;
    sql += "','";
    sql += req.body.new_manufacturer_suggested_retail_price;
    sql += "','";
    sql += req.body.conversion_to_ft;
    sql += "','";
    sql += req.body.diff_for_cost;
    sql += "','";
    sql += req.body.op_price;
    sql += "','";
    sql += req.body.po_price_jpy_usd;
    sql += "','";
    sql += req.body.po_price_currency;
    sql += "','";
    sql += req.body.remark;
    sql += "','";
    sql += req.body.thb_cost;
    sql += "','";
    sql += req.body.gp;
    sql += "','";
    sql += req.body.pricelist_name;
    sql += "','";
    sql += req.body.multiplier;
    sql += "','";
    sql += req.body.make_same_price_as_standard_price;
    sql += "','";
    sql += req.body.new_make_same_price_as_standard_price;
    sql += "','";
    sql += req.body.standard_price;
    sql += "','";
    sql += req.body.diff;
    sql += "','";
    sql += req.body.dist_pl_mull;
    sql += "','";
    sql += req.body.dist_ex_rate;
    sql += "','";
    sql += req.body.unit_price;
    sql += "','";
    sql += req.body.new_unit_price;
    sql += "','";
    sql += req.body.diff_unit_price;
    sql += "','";
    sql += req.body.status;
    sql += "','";
    sql += req.body.supplier_name;
    sql += "','";
    sql += req.body.stock_reference;
    sql += "','";
    sql += req.body.cutting_assembly;
    sql += "','";
    sql += req.body.detail;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_master_formula":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();


});


app.post("/master_formula/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update master_tsubakimoto_formula set ";
    sql += "category='";
    sql += req.body.category;
    sql += "',";
    sql += "part_no='";
    sql += req.body.part_no;
    sql += "',";
    sql += "previous_model_no='";
    sql += req.body.previous_model_no;
    sql += "',";
    sql += "new_model_no='";
    sql += req.body.new_model_no;
    sql += "',";
    sql += "unit='";
    sql += req.body.unit;
    sql += "',";
    sql += "manufacturer_suggested_retail_price='";
    sql += req.body.manufacturer_suggested_retail_price;
    sql += "',";
    sql += "new_manufacturer_suggested_retail_price='";
    sql += req.body.new_manufacturer_suggested_retail_price;
    sql += "',";
    sql += "conversion_to_ft='";
    sql += req.body.conversion_to_ft;
    sql += "',";
    sql += "diff_for_cost='";
    sql += req.body.diff_for_cost;
    sql += "',";
    sql += "op_price='";
    sql += req.body.op_price;
    sql += "',";
    sql += "po_price_jpy_usd='";
    sql += req.body.po_price_jpy_usd;
    sql += "',";
    sql += "po_price_currency='";
    sql += req.body.po_price_currency;
    sql += "',";
    sql += "remark='";
    sql += req.body.remark;
    sql += "',";
    sql += "thb_cost='";
    sql += req.body.thb_cost;
    sql += "',";
    sql += "gp='";
    sql += req.body.gp;
    sql += "',";
    sql += "pricelist_name='";
    sql += req.body.pricelist_name;
    sql += "',";
    sql += "multiplier='";
    sql += req.body.multiplier;
    sql += "',";
    sql += "make_same_price_as_standard_price='";
    sql += req.body.make_same_price_as_standard_price;
    sql += "',";
    sql += "new_make_same_price_as_standard_price='";
    sql += req.body.new_make_same_price_as_standard_price;
    sql += "',";
    sql += "standard_price='";
    sql += req.body.standard_price;
    sql += "',";
    sql += "diff='";
    sql += req.body.diff;
    sql += "',";
    sql += "dist_pl_mull='";
    sql += req.body.dist_pl_mull;
    sql += "',";
    sql += "dist_ex_rate='";
    sql += req.body.dist_ex_rate;
    sql += "',";
    sql += "unit_price='";
    sql += req.body.unit_price;
    sql += "',";
    sql += "new_unit_price='";
    sql += req.body.new_unit_price;
    sql += "',";
    sql += "diff_unit_price='";
    sql += req.body.diff_unit_price;
    sql += "',";
    sql += "status='";
    sql += req.body.status;
    sql += "',";
    sql += "supplier_name='";
    sql += req.body.supplier_name;
    sql += "',";
    sql += "stock_reference='";
    sql += req.body.stock_reference;
    sql += "',";
    sql += "cutting_assembly='";
    sql += req.body.cutting_assembly;
    sql += "',";
    sql += "detail='";
    sql += req.body.detail;
    sql += "' where Id=";
    sql += req.body.Id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_of_master_formula":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});


app.post("/master_tmp/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath =  'uploaded_files/myupload.xlsx';
     fs.rename(oldpath, newpath, function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
          wb.xlsx.readFile('uploaded_files/myupload.xlsx').then(function(){
          wb.csv.writeFile('uploaded_files/myupload.csv' )
          .then(async function() {
          console.log("saved csv...done");
          var line_cnt=0;
          lineReader.eachLine('uploaded_files/myupload.csv', async function(line, last) {
          line_cnt++;
          if (line_cnt >= 17)
          {
           var arr = line.split(",");
           for(var i=0;i<arr.length;i++) {
            if (arr[i]=="" || arr[i].indexOf('sharedFormula')!=-1) arr[i] = "blank";
            var token_number = i + 1;
            console.log("token #"+ token_number + ") " + arr[i]);
           }
           console.log("---");
           sql="insert into master_tsubakimoto_tmp(category,part_no,previous_model_no,new_model_no,unit,manufacturer_suggested_retail_price,new_manufacturer_suggested_retail_price,conversion_to_ft,diff_for_cost,op_price,po_price_jpy_usd,po_price_currency,remark,thb_cost,gp,pricelist_name,multiplier,make_same_price_as_standard_price,new_make_same_price_as_standard_price,standard_price,diff,dist_pl_mull,dist_ex_rate,unit_price,new_unit_price,diff_unit_price,status,supplier_name,stock_reference,cutting_assembly,detail)";
           sql += " values ('";
           sql += arr[0];
           sql += "','";
           sql += arr[1];
           sql += "','";
           sql += arr[2];
           sql += "','";
           sql += arr[3];
           sql += "','";
           sql += arr[4];
           sql += "','";
           sql += arr[5];
           sql += "','";
           sql += arr[6];
           sql += "','";
           sql += arr[7];
           sql += "','";
           sql += arr[8];
           sql += "','";
           sql += arr[9];
           sql += "','";
           sql += arr[10];
           sql += "','";
           sql += arr[11];
           sql += "','";
           sql += arr[12];
           sql += "','";
           sql += arr[13];
           sql += "','";
           sql += arr[14];
           sql += "','";
           sql += arr[15];
           sql += "','";
           sql += arr[16];
           sql += "','";
           sql += arr[17];
           sql += "','";
           sql += arr[18];
           sql += "','";
           sql += arr[19];
           sql += "','";
           sql += arr[20];
           sql += "','";
           sql += arr[21];
           sql += "','";
           sql += arr[22];
           sql += "','";
           sql += arr[23];
           sql += "','";
           sql += arr[24];
           sql += "','";
           sql += arr[25];
           sql += "','";
           sql += arr[26];
           sql += "','";
           sql += arr[27];
           sql += "','";
           sql += arr[28];
           sql += "','";
           sql += arr[29];
           sql += "','";
           sql += arr[30];
           sql += "')";
           console.log(sql);
           await db.query(sql);
           }
          if(last){
          }
          });
          });
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write
          (
           JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "pass",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
         });
        }
     });
     });
});

app.post("/master_tmp/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from master_tsubakimoto_tmp";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/master_tmp/deleteall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "delete from master_tsubakimoto_tmp";
 console.log(sql);
 await db.query(sql);
 res.writeHead(200, {'Content-Type': 'application/json'});
 res.write
 (
         JSON.stringify
         (
              {
                 "status":true,
                 "deleteall":
                  {
                    "table": "master_tsubakimoto_tmp",
                    "result": "pass"
                  }
              }
         )
 );
 res.end();
});

app.post("/company/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from company";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/company/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into company";
    sql += "(company_name,";
    sql += "company_info,";
    sql += "company_phone,";
    sql += "company_fax,";
    sql += "company_email,";
    sql += "company_pic)";
    sql += " values ('";
    sql += req.body.company_name;
    sql += "','";
    sql += req.body.company_info;
    sql += "','";
    sql += req.body.company_phone;
    sql += "','";
    sql += req.body.company_fax;
    sql += "','";
    sql += req.body.company_email;
    sql += "','";
    sql += req.body.company_pic;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_company":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/company/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update company set ";
    sql += "company_name='";
    sql += req.body.company_name
    sql += "',";
    sql += "company_info='";
    sql += req.body.company_info
    sql += "',";
    sql += "company_phone='";
    sql += req.body.company_phone;
    sql += "',";
    sql += "company_fax='";
    sql += req.body.company_fax;
    sql += "',";
    sql += "company_email='";
    sql += req.body.company_email;
    sql += "',";
    sql += "company_pic='";
    sql += req.body.company_pic;
    sql += "' where company_id=";
    sql += req.body.company_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_company":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/company/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from company where ";
    sql += "company_id=";
    sql += req.body.company_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from company":
                  {
                   "result": "pass",
                   "id": req.body.company_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/distributor/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from distributor_product_matching";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/distributor/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into distributor_product_matching";
    sql += "(company_id,";
    sql += "master_price_list,";
    sql += "master_pricelist_showing_name)";
    sql += " values (";
    sql += req.body.company_id;
    sql += ",'";
    sql += req.body.master_price_list;
    sql += "','";
    sql += req.body.master_pricelist_showing_name;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_distributor":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/distributor/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update distributor_product_matching set ";
    sql += "master_price_list='";
    sql += req.body.master_price_list;
    sql += "',";
    sql += "master_pricelist_showing_name='";
    sql += req.body.master_pricelist_showing_name;
    sql += "',company_id=";
    sql += req.body.company_id;
    sql += " where mc_id=";
    sql += req.body.mc_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_distributor_product_matching":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/distributor/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from distributor_product_matching where ";
    sql += "mc_id=";
    sql += req.body.mc_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from distributor_product_matching":
                  {
                   "result": "pass",
                   "id": req.body.mc_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/cost_history/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from cost_file_history";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/cost_history/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into cost_file_history";
    sql += "(cost_file_name,";
    sql += "im_path)";
    sql += " values ('";
    sql += req.body.cost_file_name;
    sql += "','";
    sql += req.body.im_path;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_cost_history":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/cost_history/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from cost_file_history where ";
    sql += "im_cost_id=";
    sql += req.body.im_cost_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from cost_history":
                  {
                   "result": "pass",
                   "id": req.body.mc_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/supplier/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from supplier_matching";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/supplier/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into supplier_matching";
    sql += "(sup_name,";
    sql += "master_pricelist_name,sup_short_name)";
    sql += " values ('";
    sql += req.body.sup_name;
    sql += "','";
    sql += req.body.master_pricelist_name;
    sql += "','";
    sql += req.body.sup_short_name;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_supplier":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/supplier/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from supplier_matching where ";
    sql += "sup_id=";
    sql += req.body.sup_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from supplier":
                  {
                   "result": "pass",
                   "id": req.body.mc_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/update_master/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from updating_master_price_list";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/update_master/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into updating_master_price_list";
    sql += "(category,";
    sql += "part_no,";
    sql += "previous_model_no,";
    sql += "new_model_no,";
    sql += "unit,";
    sql += "manufacturer_suggested_retail_price,";
    sql += "new_manufacturer_suggested_retail_price,";
    sql += "conversion_to_ft,";
    sql += "diff_for_cost,";
    sql += "op_price,";
    sql += "po_price_jpy_usd,";
    sql += "po_price_currency,";
    sql += "remark,";
    sql += "thb_cost,";
    sql += "gp,";
    sql += "pricelist_name,";
    sql += "multiplier,";
    sql += "make_same_price_as_standard_price,";
    sql += "new_make_same_price_as_standard_price,";
    sql += "standard_price,";
    sql += "diff,";
    sql += "dist_pl_mull,";
    sql += "dist_ex_rate,";
    sql += "unit_price,";
    sql += "new_unit_price,";
    sql += "diff_unit_price,";
    sql += "status,";
    sql += "supplier_name,";
    sql += "stock_reference,";
    sql += "cutting_assembly,";
    sql += "detail,Id)";
    sql += " values ('";
    sql += req.body.category;
    sql += "','";
    sql += req.body.part_no;
    sql += "','";
    sql += req.body.previous_model_no;
    sql += "','";
    sql += req.body.new_model_no;
    sql += "','";
    sql += req.body.unit;
    sql += "','";
    sql += req.body.manufacturer_suggested_retail_price;
    sql += "','";
    sql += req.body.new_manufacturer_suggested_retail_price;
    sql += "','";
    sql += req.body.conversion_to_ft;
    sql += "','";
    sql += req.body.diff_for_cost;
    sql += "','";
    sql += req.body.op_price;
    sql += "','";
    sql += req.body.po_price_jpy_usd;
    sql += "','";
    sql += req.body.po_price_currency;
    sql += "','";
    sql += req.body.remark;
    sql += "','";
    sql += req.body.thb_cost;
    sql += "','";
    sql += req.body.gp;
    sql += "','";
    sql += req.body.pricelist_name;
    sql += "','";
    sql += req.body.multiplier;
    sql += "','";
    sql += req.body.make_same_price_as_standard_price;
    sql += "','";
    sql += req.body.new_make_same_price_as_standard_price;
    sql += "','";
    sql += req.body.standard_price;
    sql += "','";
    sql += req.body.diff;
    sql += "','";
    sql += req.body.dist_pl_mull;
    sql += "','";
    sql += req.body.dist_ex_rate;
    sql += "','";
    sql += req.body.unit_price;
    sql += "','";
    sql += req.body.new_unit_price;
    sql += "','";
    sql += req.body.diff_unit_price;
    sql += "','";
    sql += req.body.status;
    sql += "','";
    sql += req.body.supplier_name;
    sql += "','";
    sql += req.body.stock_reference;
    sql += "','";
    sql += req.body.cutting_assembly;
    sql += "','";
    sql += req.body.detail;
    sql += "',";
    sql += req.body.Id
    sql += ")";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_updating_master_price_list":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();


});

app.post("/update_master/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from updating_master_price_list where ";
    sql += "Id=";
    sql += req.body.Id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from updating_master_price_list":
                  {
                   "result": "pass",
                   "id": req.body.mc_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/cost/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from cost";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/cost/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath =  'uploaded_files/myupload.xlsx';
     fs.rename(oldpath, newpath, function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
          wb.xlsx.readFile('uploaded_files/myupload.xlsx').then(function(){
          wb.csv.writeFile('uploaded_files/myupload.csv' )
          .then(async function() {
          console.log("saved csv...done");
          var line_cnt=0;
          lineReader.eachLine('uploaded_files/myupload.csv', async function(line, last) {
          line_cnt++;
          if (line_cnt >= 3)
          {
           var arr = line.split(",");
           for(var i=0;i<arr.length;i++) {
            if (arr[i]=="" || arr[i].indexOf('sharedFormula')!=-1) arr[i] = "blank";
            var token_number = i + 1;
            console.log("token #"+ token_number + ") " + arr[i]);
           }
           if (arr.length==5)
           {
            arr[5]="";
            console.log("token #"+ 5 + ") " + arr[5]);
           }
           console.log("---");
           sql="insert into cost(category,part_no,model_no,unit,manufacturer_suggested_retail_price,sub_price_list)";
           sql += " values ('";
           sql += arr[0];
           sql += "','";
           sql += arr[1];
           sql += "','";
           sql += arr[2];
           sql += "','";
           sql += arr[3];
           sql += "','";
           sql += arr[4];
           sql += "','";
           sql += arr[5];
           sql += "')";
           console.log(sql);
           await db.query(sql);
           }
          if(last){
          }
          });
          });
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write
          (
           JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "pass",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
         });
        }
     });
     });
});

app.post("/cost/deleteall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "delete from cost";
 console.log(sql);
 await db.query(sql);
 res.writeHead(200, {'Content-Type': 'application/json'});
 res.write
 (
         JSON.stringify
         (
              {
                 "status":true,
                 "deleteall":
                  {
                    "table": "cost",
                    "result": "pass"
                  }
              }
         )
 );
 res.end();
});

/*
app.post("/exchange_rate/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     //var newpath =  'uploaded_files/myupload.xlsx';
     var newpath = 'uploaded_files/' + files.file[0].originalFilename;
     fs.rename(oldpath, newpath, function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
          //wb.xlsx.readFile('uploaded_files/myupload.xlsx').then(function(){
          wb.xlsx.readFile(newpath).then(function(){
          wb.csv.writeFile('uploaded_files/myupload.csv' )
          .then(async function() {
          console.log("saved csv...done");
          var line_cnt=0;
          lineReader.eachLine('uploaded_files/myupload.csv', async function(line, last) {
          line_cnt++;
          if (line_cnt >= 3)
          {
           var arr = line.split(",");
           for(var i=0;i<arr.length;i++) {
            if (arr[i]=="" || arr[i].indexOf('sharedFormula')!=-1) arr[i] = "blank";
            var token_number = i + 1;
            console.log("token #"+ token_number + ") " + arr[i]);
           }
//           if (arr.length==5)
//           {
//            arr[5]="";
//            console.log("token #"+ 5 + ") " + arr[5]);
//           }
           console.log("---");

           sql="insert into exchange_rate(usd_br,usd_cr,usd_pr,usd_qr,eur_br,eur_cr,eur_qr,eur_pr,jpy_br,jpy_cr,jpy_pr,jpy_qr,rate_remark,rate_file_name,rate_path)";
           sql += " values (";
           sql += arr[0];
           sql += ",";
           sql += arr[1];
           sql += ",";
           sql += arr[2];
           sql += ",";
           sql += arr[3];
           sql += ",";
           sql += arr[4];
           sql += ",";
           sql += arr[5];

           sql += ",";
           sql += arr[6];

           sql += ",";
           sql += arr[7];

           sql += ",";
           sql += arr[8];

           sql += ",";
           sql += arr[9];

           sql += ",";
           sql += arr[10];

           sql += ",";
           sql += arr[11];

           sql += ",'";
           sql += arr[12];

           sql += "','";
           sql += arr[13];

           sql += "','";
           sql += arr[14];

           sql += "')";
           console.log(sql);
           await db.query(sql);
           }
          if(last){
          }
          });
          });
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write
          (
           JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "pass",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
         });
        }
     });
     });
});
*/

app.post("/exchange_rate/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath = 'uploaded_files/' + files.file[0].originalFilename;
     fs.rename(oldpath, newpath, async function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {
          var wb = new Excel.Workbook();
          wb.xlsx.readFile(newpath).then(async function(){
            var workSheet =  wb.getWorksheet("exchange rate");

            var workRow = workSheet.getRow(2);
            var usd_br = workRow.getCell(2).value;
            console.log("usd_br="+usd_br);
            var eur_br = workRow.getCell(3).value;
            console.log("eur_br="+eur_br);
            var jpy_br = workRow.getCell(4).value;
            console.log("jpy_br="+jpy_br);

            workRow = workSheet.getRow(3);
            var usd_cr = workRow.getCell(2).value;
            console.log("usd_cr="+usd_cr);
            var eur_cr = workRow.getCell(3).value;
            console.log("eur_cr="+eur_cr);
            var jpy_cr = workRow.getCell(4).value;
            console.log("jpy_cr="+jpy_cr);

            workRow = workSheet.getRow(4);
            var usd_pr = workRow.getCell(2).value;
            console.log("usd_pr="+usd_pr);
            var eur_pr = workRow.getCell(3).value;
            console.log("eur_pr="+eur_pr);
            var jpy_pr = workRow.getCell(4).value;
            console.log("jpy_pr="+jpy_pr);

            workRow = workSheet.getRow(5);
            var usd_qr = workRow.getCell(2).value;
            console.log("usd_qr="+usd_qr);
            var eur_qr = workRow.getCell(3).value;
            console.log("eur_qr="+eur_qr);
            var jpy_qr = workRow.getCell(4).value;
            console.log("jpy_qr="+jpy_qr);

            workRow = workSheet.getRow(6);
            var remark = workRow.getCell(2).value;
            console.log("remark="+remark+"\n");

            sql="insert into exchange_rate(usd_br,usd_cr,usd_pr,usd_qr,eur_br,eur_cr,eur_qr,eur_pr,jpy_br,jpy_cr,jpy_pr,jpy_qr,rate_remark,rate_file_name,rate_path)";
            sql += " values (";
            sql += usd_br;
            sql += ",";
            sql += usd_cr;
            sql += ",";
            sql += usd_pr;
            sql += ",";
            sql += usd_qr;
            sql += ",";
            sql += eur_br;
            sql += ",";
            sql += eur_cr;

            sql += ",";
            sql += eur_pr;

            sql += ",";
            sql += eur_qr;

            sql += ",";
            sql += jpy_br;

            sql += ",";
            sql += jpy_cr;

            sql += ",";
            sql += jpy_pr;

            sql += ",";
            sql += jpy_qr;

            sql += ",'";
            sql += remark;

            sql += "','";
            sql += files.file[0].originalFilename;

            sql += "','";
            sql += newpath;

            sql += "')";
            console.log(sql);
            await db.query(sql);

           res.writeHead(200, {'Content-Type': 'application/json'});
           res.write
           (
            JSON.stringify
            (
            {
             "status":true,
             "upload_excel":
              {
               "result": "pass",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
             )
           );
           res.end();
         });
        }
     });
     });
});


/*
app.post("/exchange_rate/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "SET time_zone = 'Asia/Bangkok'";
 console.log(sql);
 await db.query(sql);


 sql = "select CAST(usd_br as char) as usd_br,";
 sql += "cast(usd_cr as char) as usd_cr,";
 sql += "cast(usd_pr as char) as usd_pr,";
 sql += "cast(usd_qr as char) as usd_qr,";
 sql += "cast(eur_br as char) as eur_br,";
 sql += "cast(eur_cr as char) as eur_cr,";
 sql += "cast(eur_qr as char) as eur_qr,";
 sql += "cast(eur_pr as char) as eur_pr,";
 sql += "cast(jpy_br as char) as jpy_br,";
 sql += "cast(jpy_cr as char) as jpy_cr,";
 sql += "cast(jpy_pr as char) as jpy_pr,";
 sql += "cast(jpy_qr as char) as jpy_qr,";
 sql += "rate_remark,";
 sql += "rate_file_name,";
 sql += "rate_path,";
 sql += "DATE_FORMAT(rate_date,GET_FORMAT(DATETIME,'ISO')) as rate_date,";
 sql += "rate_id";
 sql += " from exchange_rate";


 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});
*/

app.post("/exchange_rate/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');

 sql =  "select ";

 sql += "CAST(usd_br as char) as usd_br,";
 sql += "CAST(usd_cr as char) as usd_cr,";
 sql += "CAST(usd_pr as char) as usd_pr,";
 sql += "CAST(usd_qr as char) as usd_qr,";

 sql += "CAST(eur_br as char) as eur_br,";
 sql += "CAST(eur_cr as char) as eur_cr,";
 sql += "CAST(eur_pr as char) as eur_pr,";
 sql += "CAST(eur_qr as char) as eur_qr,";

 sql += "CAST(jpy_br as char) as jpy_br,";
 sql += "CAST(jpy_cr as char) as jpy_cr,";
 sql += "CAST(jpy_pr as char) as jpy_pr,";
 sql += "CAST(jpy_qr as char) as jpy_qr,";
 sql += "rate_id,rate_remark,rate_file_name,rate_path,rate_date"

 sql += " from exchange_rate";


 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

/*
app.post("/exchange_rate/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into exchange_rate(usd_br,usd_cr,usd_pr,usd_qr,eur_br,eur_cr,eur_qr,eur_pr,jpy_br,jpy_cr,jpy_pr,jpy_qr,rate_remark,rate_file_name,rate_path)";
    sql += " values ("
    sql += req.body.usd_br;
    sql += ",";
    sql += req.body.usd_cr;
    sql += ",";
    sql += req.body.usd_pr;
    sql += ",";
    sql += req.body.usd_qr;
    sql += ",";
    sql += req.body.eur_br;
    sql += ",";
    sql += req.body.eur_cr;
    sql += ",";
    sql += req.body.eur_qr;
    sql += ",";
    sql += req.body.eur_pr;
    sql += ",";
    sql += req.body.jpy_br;
    sql += ",";
    sql += req.body.jpy_cr;
    sql += ",";
    sql += req.body.jpy_pr;
    sql += ",";
    sql += req.body.jpy_qr;
    sql += ",'";
    sql += req.body.rate_remark;
    sql += "','";
    sql += req.body.rate_file_name
    sql += "','";
    sql += req.body.rate_path
    sql += "'";
    sql += ")";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_exchange_rate":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});
*/

app.post("/exchange_rate/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into exchange_rate(usd_br,usd_cr,usd_pr,usd_qr,eur_br,eur_cr,eur_qr,eur_pr,jpy_br,jpy_cr,jpy_pr,jpy_qr,rate_remark,rate_file_name,rate_path)";
    sql += " values ("

    if (req.body.usd_br)
     sql += req.body.usd_br;
    else
     sql += "null";

    sql += ",";

    if (req.body.usd_cr)
     sql += req.body.usd_cr;
    else
     sql += "null";

    sql += ",";

    if (req.body.usd_pr)
     sql += req.body.usd_pr;
    else
     sql += "null";

    sql += ",";

    if (req.body.usd_qr)
     sql += req.body.usd_qr;
    else
     sql += "null";

    sql += ",";

    if (req.body.eur_br)
     sql += req.body.eur_br;
    else
     sql += "null";

    sql += ",";

    if (req.body.eur_cr)
     sql += req.body.eur_cr;
    else
     sql += "null";

    sql += ",";

    if (req.body.eur_qr)
     sql += req.body.eur_qr;
    else
     sql += "null";

    sql += ",";

    if (req.body.eur_pr)
     sql += req.body.eur_pr;
    else
     sql += "null";

    sql += ",";

    if (req.body.jpy_br)
     sql += req.body.jpy_br;
    else
     sql += "null";

    sql += ",";

    if (req.body.jpy_cr)
     sql += req.body.jpy_cr;
    else
     sql += "null";

    sql += ",";

    if (req.body.jpy_pr)
     sql += req.body.jpy_pr;
    else
     sql += "null";

    sql += ",";

    if (req.body.jpy_qr)
     sql += req.body.jpy_qr;
    else
     sql += "null";

    sql += ",'";

    if (req.body.rate_remark)
     sql += req.body.rate_remark;

    sql += "','";

    if (req.body.rate_file_name)
     sql += req.body.rate_file_name

    sql += "','";

    if (req.body.rate_path)
     sql += req.body.rate_path

    sql += "'";

    sql += ")";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_exchange_rate":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

/*
app.post("/exchange_rate/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update exchange_rate set ";

    sql += "usd_br=";
    sql += req.body.usd_br;

    sql += ",";
    sql += "usd_cr=";
    sql += req.body.usd_cr;

    sql += ",";
    sql += "usd_qr=";
    sql += req.body.usd_qr;

    sql += ",";
    sql += "usd_pr=";
    sql += req.body.usd_pr;

    sql += ",";
    sql += "eur_br=";
    sql += req.body.eur_br;

    sql += ",";
    sql += "eur_cr=";
    sql += req.body.eur_cr;

    sql += ",";
    sql += "eur_qr=";
    sql += req.body.eur_cr;

    sql += ",";
    sql += "eur_pr=";
    sql += req.body.eur_pr;



    sql += ",";
    sql += "jpy_br=";
    sql += req.body.jpy_br;

    sql += ",";
    sql += "jpy_cr=";
    sql += req.body.jpy_cr;

    sql += ",";
    sql += "jpy_qr=";
    sql += req.body.jpy_qr;

    sql += ",";
    sql += "jpy_pr=";
    sql += req.body.jpy_pr;



    sql += ",";
    sql += "rate_remark='";
    sql += req.body.rate_remark;

    sql += "',";
    sql += "rate_file_name='";
    sql += req.body.rate_file_name;

    sql += "',";
    sql += "rate_path='";
    sql += req.body.rate_path;

    sql += "' where rate_id=";
    sql += req.body.rate_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_exchange_rate":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});
*/

app.post("/exchange_rate/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update exchange_rate set ";

    if (req.body.usd_br)
     {
      sql += ",";
      sql += "usd_br=";
      sql += req.body.usd_br;
     }

    if (req.body.usd_cr)
    {
     sql += ",";
     sql += "usd_cr=";
     sql += req.body.usd_cr;
    }

    if (req.body.usd_qr)
    {
     sql += ",";
     sql += "usd_qr=";
     sql += req.body.usd_qr;
    }

    if (req.body.usd_pr)
    {
     sql += ",";
     sql += "usd_pr=";
     sql += req.body.usd_pr;
    }

    if (req.body.eur_br)
    {
     sql += ",";
     sql += "eur_br=";
     sql += req.body.eur_br;
    }

    if (req.body.eur_cr)
    {
     sql += ",";
     sql += "eur_cr=";
     sql += req.body.eur_cr;
    }

    if (req.body.eur_cr)
    {
     sql += ",";
     sql += "eur_qr=";
     sql += req.body.eur_cr;
    }

    if (req.body.eur_pr)
    {
     sql += ",";
     sql += "eur_pr=";
     sql += req.body.eur_pr;
    }

    if (req.body.jpy_br)
    {
     sql += ",";
     sql += "jpy_br=";
     sql += req.body.jpy_br;
    }

    if (req.body.jpy_cr)
    {
     sql += ",";
     sql += "jpy_cr=";
     sql += req.body.jpy_cr;
    }

    if (req.body.jpy_qr)
    {
     sql += ",";
     sql += "jpy_qr=";
     sql += req.body.jpy_qr;
    }

    if (req.body.jpy_pr)
    {
     sql += ",";
     sql += "jpy_pr=";
     sql += req.body.jpy_pr;
    }

    if (req.body.rate_remark)
     {
      sql += ",";
      sql += "rate_remark='";
      sql += req.body.rate_remark;
      sql += "'";
     }

    if (req.body.rate_file_name)
     {
      sql += ",";
      sql += "rate_file_name='";
      sql += req.body.rate_file_name;
      sql += "'";
     }

    if (req.body.rate_path)
     {
      sql += ",";
      sql += "rate_path='";
      sql += req.body.rate_path;
      sql += "'";
     }

    sql += " where rate_id=";
    sql += req.body.rate_id;

    sql = sql.replace("update exchange_rate set ,", "update exchange_rate set ");
    console.log(sql);

    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_exchange_rate":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});


app.post("/exchange_rate/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from exchange_rate where ";
    sql += "rate_id=";
    sql += req.body.rate_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from exchange_rate":
                  {
                   "result": "pass",
                   "id": req.body.rate_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/exchange_rate_history/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from exchange_rate_history";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/exchange_rate_history/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from exchange_rate_history where ";
    sql += "rate_doc_id=";
    sql += req.body.rate_doc_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from exchange_rate_history":
                  {
                   "result": "pass",
                   "id": req.body.rate_doc_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/exchange_rate_history/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into exchange_rate_history(rate_doc_name,rate_doc_path) values ('";
    sql += req.body.rate_doc_name;
    sql += "','";
    sql += req.body.rate_doc_path;
    sql += "')";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "upload exchange_rate document name and document path":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/exchange_rate_history/download", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "select * from exchange_rate_history where ";
    sql += "rate_doc_id=";
    sql += req.body.rate_doc_id;
    console.log(sql);
    //await db.query(sql);
    var results = await db.query(sql);
    console.log(results)
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "show download link":
                  {
                   "document_name": results[0].rate_doc_name,
                   "document_path": results[0].rate_doc_path,
                   "document_download_link": "http://deploy-aws.com:3006/downloadfiletocomputer?fileurl="+results[0].rate_doc_name
                  }
                 }
               )
              );
    res.end();
});

//downloadfiletocomputer
//fileurl=http://deploy-aws.com:3006/uploaded_files/exchange_rate_template_version_1.xlsx
app.get("/downloadfiletocomputer", (req, res) => {
    //console.log(req.query.fileurl);
    //const file = ${__dirname}+"/uploaded_files/"+req.query.fileurl`;
    //console.log(file);
    //res.download(file); // Set disposition and send it.

//    var filePath = "uploaded_files/"; // Or format the path using the `id` rest param
//    var fileName = req.query.fileurl; // The default name the browser will use
    //res.download(filePath, fileName);

//    res.download(filePath, fileName, function (error) {
//            console.log("Error : ", error)
//        });

    //console.log(__dirname + '/uploaded_files/' + req.query.fileurl);

    //console.log(req.path);

//    if (req.path !== '/') {
//          res.download(__dirname + '/uploaded_files/' + req.query.fileurl, req.query.fileurl, function(err){
//                      console.log("Error : ", err)
//                  });
//       } else {
//           next();
//       }

//    res.download(__dirname + '/uploaded_files/' + req.query.fileurl, req.query.fileurl, function(err){
//            console.log("Error : ", err)
//        });

    //res.json({ "File": "downloaded" });

    if (req.query.fileurl.indexOf('pdf') >= 0){
       //pdf

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=" + "download.pdf");

       //const buff =  fs.readFileSync(__dirname + '/uploaded_files/' + req.query.fileurl);
       //fs.writeFileSync(res, buff);
       //res.end();
//       fs.readFileSync(__dirname + '/uploaded_files/' + req.query.fileurl).then(file => {
//             res.send(file);
//          });

//       fs.readFile(__dirname + '/uploaded_files/' + req.query.fileurl, { encoding: 'utf8', flag: 'r' }, (err, data1) => {
//         if (err) {
//           console.error('Error reading input file', err);
//         } else {
//           res.send(data1);
//         }
//       });

       var data =fs.readFileSync(__dirname + '/uploaded_files/' + req.query.fileurl);
       res.contentType("application/pdf");
       res.setHeader("Content-Disposition", "attachment; filename=" + "download.pdf");
       res.send(data);

//        console.log(__dirname + '/uploaded_files/' + req.query.fileurl);
//        res.send(__dirname + '/uploaded_files/' + req.query.fileurl);


      }
    else {
      //xlsx
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "download.xlsx");

       var wb = new Excel.Workbook();
          wb.xlsx.readFile(__dirname + '/uploaded_files/' + req.query.fileurl).then(function(){
            wb.xlsx.write(res).then(() => {

              //res.json({ "File": "downloaded" });
              res.end();


            });
          });
    }



    //res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "download.xlsx");

    // Write the workbook to the response object
    //workbook.xlsx.write(res).then(() => res.end());

//    var wb = new Excel.Workbook();
//    wb.xlsx.readFile(__dirname + '/uploaded_files/' + req.query.fileurl).then(function(){
//      wb.xlsx.write(res).then(() => {
//
//        //res.json({ "File": "downloaded" });
//        res.end();
//
//
//      });
//    });
});

app.post("/news_info/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from news_info";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/news_info/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update news_info set ";

    sql += "title='";
    sql += req.body.title;

    sql += "',";
    sql += "content='";
    sql += req.body.content;

    sql += "',";
    sql += "news_date='";
    //sql += new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');
    //sql += req.body.usd_qr;
    let ts = Date.now();
    let date_time = new Date(ts);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    //console.log(year + "-" + month + "-" + date);
    sql += year + "-" + month + "-" + date;

    sql += "',";
    sql += "showing_order=";
    sql += req.body.showing_order;

    sql += ",";
    sql += "short_content='";
    sql += req.body.short_content;

    sql += "' where news_id=";
    sql += req.body.news_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_news_info":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/news_info/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from news_info where ";
    sql += "news_id=";
    sql += req.body.news_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from news_info":
                  {
                   "result": "pass",
                   "id": req.body.news_id
                  }
                 }
               )
              );
    res.end();
});


app.post("/quotation_list/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from quotation_list";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/quotation_list/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update quotation_list set ";

    sql += "quot_no='";
    sql += req.body.quot_no;

    sql += "',";
    sql += "user_id=";
    sql += req.body.user_id;

    sql += ",";
    sql += "update_time='";
    //sql += new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');
    //sql += req.body.usd_qr;

     let ts = Date.now();
     let date_time = new Date(ts);
     let date = date_time.getDate();
     let month = date_time.getMonth() + 1;
     let year = date_time.getFullYear();
     //console.log(year + "-" + month + "-" + date);
     sql += year + "-" + month + "-" + date;

    sql += "',";
    sql += "quot_stat='";
    sql += req.body.quot_stat;

    sql += "',";
    sql += "quot_ver=";
    sql += req.body.quot_ver;

    sql += " where quot_id=";
    sql += req.body.quot_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_quotation_list":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/quotation_list/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from quotation_list where ";
    sql += "quot_id=";
    sql += req.body.quot_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from quotation_list":
                  {
                   "result": "pass",
                   "id": req.body.quot_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/quotation_list/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into quotation_list(quot_no,user_id,update_time,quot_stat,quot_ver)";
    sql += " values ('"
    sql += req.body.quot_no;
    sql += "',";
    sql += req.body.user_id;
    sql += ",'";

    //sql += new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');
    let ts = Date.now();
    let date_time = new Date(ts);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    //console.log(year + "-" + month + "-" + date);
    sql += year + "-" + month + "-" + date;

    sql += "','";
    sql += req.body.quot_stat;
    sql += "',";
    sql += req.body.quot_ver;
    sql += ")";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_quotation_list":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/quotation_product/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from quotation_product";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/quotation_product/getquotationbyid", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from quotation_product where quotation_product_id=";
 sql += req.body.quotation_product_id
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/quotation_product/update", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "update quotation_product set ";

    sql += "quot_id=";
    sql += req.body.quot_id;

    sql += ",";
    sql += "Id=";
    sql += req.body.Id;

    sql += ",";
    sql += "quantity=";
    sql += req.body.quantity;

    sql += ",";
    sql += "unit_price=";
    sql += req.body.unit_price;

    sql += ",";
    sql += "total_price=";
    sql += req.body.total_price;

    sql += " where quotation_product_id=";
    sql += req.body.quotation_product_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "update_record_to_quotation_product":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});

app.post("/quotation_product/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from quotation_product where ";
    sql += "quotation_product_id=";
    sql += req.body.quotation_product_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from quotation_product":
                  {
                   "result": "pass",
                   "id": req.body.quotation_product_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/quotation_product/add", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "insert into quotation_product(quot_id,Id,quantity,unit_price,total_price)";
    sql += " values ("
    sql += req.body.quot_id;
    sql += ",";
    sql += req.body.Id;
    sql += ",";
    sql += req.body.quantity;
    sql += ",";
    sql += req.body.unit_price;
    sql += ",";
    sql += req.body.total_price;
    sql += ")";
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
              res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "add_record_to_quotation_product":
                  {
                   "result": "pass"
                  }
                 }
               )
              );
    res.end();
});


app.post("/quotation_file_record/listall", async (req, res) => {
 const db = require('./db');
 const config = require('./config');
 const helper = require('./helper');
 sql = "select * from quotation_file_record";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 res.json(results);
});

app.post("/quotation_file_record/delete", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "delete from quotation_file_record where ";
    sql += "quot_file_id=";
    sql += req.body.quot_file_id;
    console.log(sql);
    await db.query(sql);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "delete_record_from quotation_file_record":
                  {
                   "result": "pass",
                   "id": req.body.quot_file_id
                  }
                 }
               )
              );
    res.end();
});

app.post("/quotation_file_record/upload", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
     var oldpath = files.file[0].filepath;
     var newpath = 'uploaded_files/' + files.file[0].originalFilename;
     fs.rename(oldpath, newpath, function (err) {
       if (err)
       {
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.write
         (
          JSON.stringify
           (
            {
             "status":true,
             "upload_excel":
              {
               "result": "fail",
               "oldpath": oldpath,
               "newpath": newpath
              }
             }
           )
          );
          res.end();
       }
       else
       {


          res.writeHead(200, {'Content-Type': 'application/json'});
          res.write
                   (
                    JSON.stringify
                    (
                     {
                      "status":true,
                      "upload_pdf":
                       {
                        "result": "pass",
                        "oldpath": oldpath,
                        "newpath": newpath
                       }
                      }
                    )
                   );
           res.end();


       }
      });
      });
     });

app.post("/quotation_file_record/download", async (req, res) => {
    const db = require('./db');
    const config = require('./config');
    const helper = require('./helper');

    sql = "select * from quotation_file_record where ";
    sql += "quot_file_id=";
    sql += req.body.quot_file_id;
    console.log(sql);
    //await db.query(sql);
    //"document_download_link": "http://deploy-aws.com:3006/downloadfiletocomputer?fileurl="+results[0].quot_name
    var results = await db.query(sql);
    console.log(results)
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
              (
               JSON.stringify
               (
                {
                 "status":true,
                 "show download link":
                  {
                   "document_name": results[0].quot_name,
                   "document_path": results[0].quot_path,
                   "document_download_link": "http://deploy-aws.com:3006/downloadfiletocomputer?fileurl="+results[0].quot_name
                  }
                 }
               )
              );
    res.end();
});




app.use("/webcrawler", webCrawlerRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/listuser", listUserRouter);
app.use("/edit", editUserRouter);
app.use("/delete", deleteUserRouter);
app.use("/getuserbyid", getUserByIdRouter);
app.use("/upload_excel", uploadExcelRouter);
app.use("/upload_excel_update_master_sugar_stock",upload_excel_update_master_sugar_stock_Router);
app.use("/upload_excel_update_master_sprocket_pricelist",upload_excel_update_master_sprocket_pricelist_Router);
app.use("/upload_excel_update_master_small_size_chain_pricelist",upload_excel_update_master_small_size_chain_pricelist_Router);
app.use("/upload_excel_update_master_ptuc_other_dist",upload_excel_update_master_ptuc_other_dist_Router);
app.use("/upload_excel_update_master_ptuc_kte",upload_excel_update_master_ptuc_kte_Router);
app.use("/upload_excel_update_master_kte_stock",upload_excel_update_master_kte_stock_Router);
app.use("/upload_excel_update_master_jpy_chain",upload_excel_update_master_jpy_chain_Router);
app.use("/upload_excel_update_master_akt_format_warehouse_pricelist",upload_excel_update_master_akt_format_warehouse_pricelist_Router);
app.use("/upload_excel_update_master_akt_format_scg_group_chain",upload_excel_update_master_akt_format_scg_group_chain_Router);
app.use("/upload_excel_update_master_akt_format_scg_group_cam_clutch",upload_excel_update_master_akt_format_scg_group_cam_clutch_Router);
app.use("/upload_excel_update_master_akt_format_kabelschlepp",upload_excel_update_master_akt_format_kabelschlepp_Router);
app.use("/upload_excel_update_master_drivechain",upload_excel_update_master_drivechain_Router);
app.use("/upload_excel_update_user_data_tsubakimoto",upload_excel_update_user_data_tsubakimoto_Router);
app.use("/get_master_akt_format_kabelschlepp", get_master_akt_format_kabelschlepp_Router);
app.use("/clear_master_tsubakimoto_database", clear_master_tsubakimoto_database_Router);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
