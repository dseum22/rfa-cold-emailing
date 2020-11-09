function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function sendColdEmail(senderName, spreadsheetLink) {
  // activate both sheets
  var ss = SpreadsheetApp.openByUrl(spreadsheetLink);
  //ss.getSheetByName("Main").activate();
  //ss.getSheetByName("Control").activate();
  
  const mainSheet = ss.getSheetByName("Main");
  const controlSheet = ss.getSheetByName("Control");
  
  // logistics setup
  var rowNum = mainSheet.getLastRow();
  var emailStyle = "<p style='font-family:Times New Roman;font-size:16px;'>{body}</p>"
  var runDate = new Date();
  
  // send every email
  for (var i = 3; i <= rowNum; i++) {
    let dateCheck = mainSheet.getRange(i, 1);  
    if (dateCheck.isBlank()) {
      let emailType = mainSheet.getRange(i, 11).getValue();
      
      // variable info
      let generalSubject = controlSheet.getRange(3,emailType).getValue();
      let generalBody = controlSheet.getRange(5,emailType).getValue().split("\n\n").slice(0,-1).join("<br><br>"); 
      // separate and add back signature *** find more efficient way to separate sign, maybe loop
      let generalSign = "<br>" + controlSheet.getRange(5,emailType).getValue().split("\n").slice(1).slice(-4).join("<br>");
      generalBody += generalSign;
  
      var receiverName = mainSheet.getRange(i, 9).getValue();
      var schoolName = mainSheet.getRange(i, 5).getValue();
    
      // email content
      var emailAddress = mainSheet.getRange(i, 10).getValue();
      var emailSubject = generalSubject.replace("{schoolName}", schoolName);
      var emailBody = generalBody.replace("{receiverName}", receiverName).replace(new RegExp("{senderName}", "g"), senderName);
    
      // send entire email
      MailApp.sendEmail(emailAddress, emailSubject, "", {htmlBody: emailStyle.replace("{body}", emailBody)});
    
      // note send date
      dateCheck.setValue(runDate);
      
      /** 
      // test logs
      Logger.log(emailAddress);
      Logger.log(emailSubject);
      Logger.log(emailBody);
      **/
    }  
  }
}