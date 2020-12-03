function sendColdEmail() {
  // fetch moment js library
  eval(UrlFetchApp.fetch('https://momentjs.com/downloads/moment.js').getContentText());

  // manual
  const bodyTypes = 3;

  // get sheets
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const mainSheet = ss.getSheetByName("Main");
  const controlSheet = ss.getSheetByName("Control");

  // constant info
  const rowNum = mainSheet.getLastRow();
  const emailStyle = "<p style='font-family:Times New Roman;font-size:16px;color:black;'>{body}</p>"
  const runDate = moment();
  const senderName = controlSheet.getRange(8, 2).getValue();

  // get email info
  let generalSubjects = controlSheet.getRange(3, 1, 1, bodyTypes).getValues()[0];
  let generalBodies = (function () {
    let output = [];
    for (var i = 1; i <= bodyTypes; i++) {
      output.push(controlSheet.getRange(5, i).getValue().split("\n\n").slice(0, -1).join("<br><br>"));
    }
    return output
  })();
  let generalSigns = (function () {
    let output = [];
    for (var i = 1; i <= bodyTypes; i++) {
      output.push("<br>" + controlSheet.getRange(5, i).getValue().split("\n").slice(1).slice(-4).join("<br>"));
    }
    return output
  })();

  // send every email
  for (var i = 3; i <= rowNum; i++) {
    let isResponseBlank = mainSheet.getRange(i, 4).isBlank();
    // clean this here
    if (isResponseBlank && mainSheet.getRange(i, 3).isBlank()) {
      // check first date
      let dateCheck1 = mainSheet.getRange(i, 1);

      // get contact info
      var receiverName = mainSheet.getRange(i, 9).getValue();
      var schoolName = mainSheet.getRange(i, 5).getValue();
      var emailAddress = mainSheet.getRange(i, 10).getValue();

      // what type of email, 1 or 2
      let emailType = mainSheet.getRange(i, 11).getValue() - 1;
      if (dateCheck1.isBlank()) {
        // setup email
        let tempBody = generalBodies[emailType] + generalSigns[emailType];
        var emailSubject = generalSubjects[emailType].replace("{schoolName}", schoolName);
        var emailBody = tempBody.replace("{receiverName}", receiverName).replace(new RegExp("{senderName}", "g"), senderName);

        // send email
        GmailApp.sendEmail(emailAddress, emailSubject, "", {
          htmlBody: emailStyle.replace("{body}", emailBody)
        });

        // note send date
        dateCheck1.setValue(runDate.format('YYYY-MM-DD'));
      } else {
        let dateCheck2 = mainSheet.getRange(i, 2);
        let dateTarget2 = moment(dateCheck1.getValue()).add(7, 'days');
        if (dateCheck2.isBlank() && moment(runDate).isAfter(dateTarget2)) {
          // setup email
          let tempBody = generalBodies[2] + generalSigns[2];
          var emailSubject = generalSubjects[emailType].replace("{schoolName}", schoolName);
          var emailBody = tempBody.replace("{receiverName}", receiverName).replace(new RegExp("{senderName}", "g"), senderName);

          // setup draft and send
          let sentThreads = GmailApp.search('from:me to:' + emailAddress);
          let mostRecentThread = sentThreads[0];
          let draft = mostRecentThread.createDraftReply('');
          draft.update(emailAddress, emailSubject, '', {
            htmlBody: emailStyle.replace("{body}", emailBody)
          });
          draft.send();

          // note send date
          dateCheck2.setValue(runDate.format('YYYY-MM-DD'));
        } else if (!dateCheck2.isBlank()) {
          let dateTarget3 = moment(dateCheck2.getValue()).add(7, 'days');
          if (moment(runDate).isAfter(dateTarget3)) {
            // setup email
            let tempBody = generalBodies[2] + generalSigns[2];
            var emailSubject = generalSubjects[emailType].replace("{schoolName}", schoolName);
            var emailBody = tempBody.replace("{receiverName}", receiverName).replace(new RegExp("{senderName}", "g"), senderName);

            // setup draft and send
            let sentThreads = GmailApp.search('from:me to:' + emailAddress);
            let mostRecentThread = sentThreads[0];
            let draft = mostRecentThread.createDraftReply('');
            draft.update(emailAddress, emailSubject, '', {
              htmlBody: emailStyle.replace("{body}", emailBody)
            });
            draft.send();

            // note send date
            mainSheet.getRange(i, 3).setValue(runDate.format('YYYY-MM-DD'));
          }
        }
      }
    }
  }
}