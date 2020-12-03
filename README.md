# rfa-cold-emailing
This GApps script sends emails to shool contacts listed in a Google spreadsheet.

Spreadsheet inputs: School name, Principal name, Principal email, Email type
There are three different emails that give: Email subject, Email body

For the first email sent, a first date is logged. Every run, the script checks to see if it has been more than one week since the last email: if there was no response, the script sends a second email as a reply reminder. The same happens after one more week.

