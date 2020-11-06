'use strict'
let { graphql } = require("@octokit/graphql")

module.exports = async function exportAuditLog (after) {

    graphql = graphql.defaults({
        method: 'POST',
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
    });

    const query = `query ($after: String) {
        organization(login:"PUT_ORG_HERE") {
          auditLog(first: 100, after: $after, query: "created:>=2019-09-01T21:51:46"){
            nodes{
              ... on AuditEntry {
                action
                actorLogin
                createdAt
                operationType
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
    }`

  const auditEntries = []

  async function getAuditEntries (after) {
    const result = await graphql(query, { after })
    const { nodes, pageInfo } = result.organization.auditLog
    
    nodes.forEach(node => {
        auditEntries.push(node)
    })
    
    if (pageInfo.hasNextPage) {
        return getAuditEntries(pageInfo.endCursor)
    } 

    return auditEntries
  }
    
  return getAuditEntries()
}
