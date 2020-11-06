require('dotenv').config()
const fs = require('fs')
const path = require('path')
const beautify = require("json-beautify");
const auditEntries = require('./lib/exportAuditLog.js')

async function getAuditLog() {
    
    const auditLogEntries = []

    const results = await auditEntries(null)

    results.forEach(result => {
        auditLogEntries.push(result)
    });
    
    var json = beautify(auditLogEntries, null, 2, null)
    var fs = require('fs');
    fs.writeFile('audit-log-entries.json', json, function(err){
        if (err) throw err
        console.log('file saved!')
    });
}

getAuditLog()

