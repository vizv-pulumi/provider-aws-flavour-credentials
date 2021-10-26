import { AwsFlavouredCredentials } from './lib'

const awsCredentials = new AwsFlavouredCredentials('aws-credentials', {})

export const accountId = awsCredentials.accountId
export const accessKeyId = awsCredentials.accessKeyId
export const secretAccessKey = awsCredentials.secretAccessKey
