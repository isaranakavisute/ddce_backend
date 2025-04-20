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
                         "oldpath": "test",
                         "newpath": "test"
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
