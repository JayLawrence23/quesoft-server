export default ({ ave, numberVisitor, rate, totalVolume }) => {
    const today = new Date();

   const createRowNum = (item) => `
         <tr>
            <td>${item._id}</td>
            <td>${item.count}</td>
         </tr>
         `;

   const createRowAve = (item) => `
         <tr>
            <td>${item._id}</td>
            <td>${item.ave}</td>
         </tr>
         `;
   const rowsNum = numberVisitor?.map(createRowNum).join('');
   const rowsAve = ave?.map(createRowAve).join('');
   const html = `<!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>PDF Result Template</title>
         <style>
            .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
            }
            .margin-top {
            margin-top: 50px;
            }
            .justify-center {
            text-align: center;
            }
            .title {
              font-size: 22px;
            }
            .changes{
              font-size: 15px;
              color: green;
            }
            .section-title{
              font-weight: bold;
           }
            .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            }
            .invoice-box table td {
            padding: 5px;
            vertical-align: top;
            }
            .invoice-box table tr td:nth-child(2) {
            text-align: right;
            }
            .invoice-box table tr.top table td {
            padding-bottom: 20px;
            }
            .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
            }
            .invoice-box table tr.information table td {
            padding-bottom: 40px;
            }
            .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            }
            .invoice-box table tr.details td {
            padding-bottom: 20px;
            }
            .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
            }
            .invoice-box table tr.item.last td {
            border-bottom: none;
            }
            .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
            }
            @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
            }
            .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
            }
            }
         </style>
      </head>
      <body>
         <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
               <tr class="top">
                  <td colspan="2">
                     <table>
                        <tr>
                          <td class="title"><img src="https://i.ibb.co/dK3PKmb/logo-que.png" alt="logo-que" border="0"
                             style="width:100%; max-width:106px;"></td>
                          <td>
                              Date: ${`${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}.`}
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
               <tr class="information">
              <td colspan="2">
                 <table>
                    <tr>
                       <td class="title">
                          <b>Queuing System Reports</b>
                       </td>
                          
                       </tr>
                    </table>
                 </td>
              </tr>
              
              <tr>
                    <td>
                       <p class="section-title">Number of Visitors on the last 30 days</p>
                    </td>
                 </tr>

              <tr>
                 <td>
                    <table class="tablenum">
                       <tr class="heading">
                          <td>Services</td>
                          <td>Volume</td>
                       </tr>
        
                        ${rowsNum}
                     
                    </table>
                 </td>
              </tr>
              
              <tr>
                    <td>
                       <p class="section-title">Average Serving Time on the last 30 days</p>
                    </td>
                 </tr>
              
              
              <tr>
                 <td>
                    <table>
                       <tr class="heading">
                          <td>Services</td>
                          <td>Time</td>
                       </tr>
                       ${rowsAve}
                    </table>
                 </td>
              </tr>

              
              <tr>
                 <table>
                    <tr class="heading">
                       <td>Service that needs improvement:</td>
                       <td>Service</td>
                    </tr>
                 </table>
              </tr>

              
           </table>
           <br />
           <h2 class="justify-center">Total volume on the last 30 days: ${totalVolume} <span class="changes">${rate}% from last month</span></h2>
         </div>
      </body>
   </html>`
   return html;
};