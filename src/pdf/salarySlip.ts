// import PDFDocument from "pdfkit";
// import path from "path";

// interface SalarySlipData {
//     employeeName: string;
//     employeeId: string;
//     designation: string;
//     department?: string;
//     month: string;
//     status: string;
//     paidDate?: string;
//     generatedOn: string;
//     baseSalary: number;
//     lopDays: number;
//     wfhDays: number;
//     deductionAmount: number;
//     netSalary: number;
//     remarks?: string;
// }

// export const generateSalarySlip = (doc: PDFKit.PDFDocument, data: SalarySlipData) => {
//     const logo = path.join(__dirname, "../assets/logo.png");

//     /*
//     =====================================
//     COMPANY LOGO
//     =====================================
//     */

//     doc.image(
//         logo,
//         230,
//         30,
//         {
//             width: 120
//         }
//     );

//     doc.moveDown(4);

//     /*
//     =====================================
//     COMPANY NAME
//     =====================================
//     */

//     doc
//         .fontSize(22)
//         .font("Helvetica-Bold")
//         .text(
//             "SOURCERY IT SOLUTIONS",
//             {
//                 align: "center"
//             }
//         );

//     doc
//         .fontSize(11)
//         .font("Helvetica")
//         .text(
//             "www.sourceryit.com",
//             {
//                 align: "center"
//             }
//         );

//     doc
//         .fontSize(17)
//         .font("Helvetica-Bold")
//         .text(
//             "Salary Slip",
//             {
//                 align: "center"
//             }
//         );

//     doc
//         .fontSize(13)
//         .text(data.month, {
//             align: "center"
//         });

//     doc.moveDown();

//     line(doc);

//     /*
//     =====================================
//     EMPLOYEE INFORMATION
//     =====================================
//     */

//     title(
//         doc,
//         "Employee Information"
//     );

//     row(
//         doc,
//         "Employee Name",
//         data.employeeName
//     );

//     row(
//         doc,
//         "Employee ID",
//         data.employeeId
//     );

//     row(
//         doc,
//         "Designation",
//         data.designation
//     );

//     row(
//         doc,
//         "Department",
//         data.department || "-"
//     );

//     row(
//         doc,
//         "Status",
//         data.status
//     );

//     line(doc);

//     /*
//     =====================================
//     EARNINGS
//     =====================================
//     */

//     title(
//         doc,
//         "Earnings"
//     );

//     amountRow(
//         doc,
//         "Base Salary",
//         data.baseSalary
//     );

//     doc.moveDown();

//     doc
//         .font("Helvetica-Bold")
//         .text(
//             `Total Earnings : ₹${money(
//                 data.baseSalary
//             )}`,
//             {
//                 align: "right"
//             }
//         );

//     line(doc);

//     /*
//     =====================================
//     DEDUCTIONS
//     =====================================
//     */

//     title(
//         doc,
//         "Deductions"
//     );

//     amountRow(
//         doc,
//         `LOP (${data.lopDays} Day)`,
//         data.lopDays
//             ? data.deductionAmount *
//             (data.lopDays /
//                 (data.lopDays +
//                     data.wfhDays))
//             : 0
//     );

//     amountRow(
//         doc,
//         `WFH (${data.wfhDays} Day)`,
//         data.wfhDays
//             ? data.deductionAmount *
//             (data.wfhDays /
//                 (data.lopDays +
//                     data.wfhDays))
//             : 0
//     );

//     doc.moveDown();

//     doc
//         .font("Helvetica-Bold")
//         .text(
//             `Total Deduction : ₹${money(
//                 data.deductionAmount
//             )}`,
//             {
//                 align: "right"
//             }
//         );

//     line(doc);

//     /*
//     =====================================
//     NET SALARY
//     =====================================
//     */

//     doc
//         .fontSize(18)
//         .font("Helvetica-Bold")
//         .fillColor("#008000")
//         .text(
//             `Net Salary : ₹${money(
//                 data.netSalary
//             )}`,
//             {
//                 align: "center"
//             }
//         );

//     doc.fillColor("black");

//     line(doc);

//     /*
//     =====================================
//     PAYMENT DETAILS
//     =====================================
//     */

//     title(
//         doc,
//         "Payment Details"
//     );

//     row(
//         doc,
//         "Paid Date",
//         data.paidDate || "-"
//     );

//     row(
//         doc,
//         "Generated On",
//         data.generatedOn
//     );

//     if (data.remarks) {

//         row(
//             doc,
//             "Remarks",
//             data.remarks
//         );

//     }

//     line(doc);

//     /*
//     =====================================
//     SIGNATURES
//     =====================================
//     */

//     doc.moveDown(3);

//     doc.text(
//         "Employee Signature",
//         60
//     );

//     doc.text(
//         "Authorized Signatory",
//         330
//     );

//     doc.moveDown(2);

//     doc.text(
//         "_________________",
//         60
//     );

//     doc.text(
//         "_________________",
//         330
//     );

//     /*
//     =====================================
//     FOOTER
//     =====================================
//     */

//     doc.moveDown(4);

//     doc
//         .fontSize(10)
//         .font("Helvetica-Oblique")
//         .text(
//             "This is a computer generated salary slip.",
//             {
//                 align: "center"
//             }
//         );
// };

// /*
// =====================================
// HELPERS
// =====================================
// */

// function line(
//     doc: PDFKit.PDFDocument
// ) {

//     doc.moveDown();

//     doc
//         .moveTo(50, doc.y)
//         .lineTo(550, doc.y)
//         .stroke();

//     doc.moveDown();

// }

// function title(
//     doc: PDFKit.PDFDocument,
//     text: string
// ) {

//     doc
//         .fontSize(15)
//         .font("Helvetica-Bold")
//         .text(text);

//     doc.moveDown();

// }

// function row(
//     doc: PDFKit.PDFDocument,
//     label: string,
//     value: string
// ) {

//     doc
//         .font("Helvetica")
//         .fontSize(12)
//         .text(label, 60);

//     doc.text(
//         value,
//         300,
//         doc.y - 14
//     );

//     doc.moveDown();

// }

// function amountRow(
//     doc: PDFKit.PDFDocument,
//     label: string,
//     amount: number
// ) {

//     doc
//         .font("Helvetica")
//         .fontSize(12)
//         .text(label, 60);

//     doc.text(
//         `₹${money(amount)}`,
//         420,
//         doc.y - 14
//     );

//     doc.moveDown();

// }

// function money(
//     amount: number
// ) {

//     return Number(amount).toLocaleString(
//         "en-IN",
//         {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//         }
//     );

// }