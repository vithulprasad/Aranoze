const excelJs = require('exceljs')
const Order =require("../model/order-model")

const downloadExcel = async (req, res) => {
    try {

        const from=req.query.from
    const to=req.query.to
    let query={orderStatus:"Delivered"}

   
    if(from&&to){
        let toDate = new Date(to)
        toDate.setHours(24)
        query.date={
            $gte: new Date(from),
            $lte: toDate,

        };
    }else if(from){
        query.date={
            $gte:from,  
        }
    }else if (to) {
        query.date = {
          $lte: to,
        };
      }

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report")

        worksheet.columns = [
            { header: "OderID", key: "_id" },
            { header: "Date", key: "date" },
            { header: "Payment Method", key: "paymentType" },
            { header: "Total Amount", key: "totalAmount" },
        ]
        const deliveredProducts = await Order.find(query).populate('user').lean()
        deliveredProducts.forEach((things) => {
            worksheet.addRow(things)
        })

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true }
        });


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
        )
        res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`)
        return workbook.xlsx.write(res).then(() => {
            res.status(200);
        })

    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    downloadExcel,

}