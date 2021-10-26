import * as pulumi from '@pulumi/pulumi'
import { generateAwsFlavourCredentials } from 'aws-credentials-generator'
import { v4 } from 'uuid'

class AwsFlavouredCredentialsProvider
  implements pulumi.dynamic.ResourceProvider
{
  async create(inputs: any) {
    return {
      id: v4(),
      outs: generateAwsFlavourCredentials(),
    }
  }

  async diff(id: pulumi.ID, olds: any, news: any) {
    return {
      changes: olds.__provider !== news.__provider,
    }
  }

  async update(id: pulumi.ID, olds: any, news: any) {
    const { accountId, accessKeyId, secretAccessKey } = olds
    return {
      outs: { ...news, accountId, accessKeyId, secretAccessKey },
    }
  }
}

class AwsFlavouredCredentialsDynamicResource extends pulumi.dynamic.Resource {
  public readonly accountId!: pulumi.Output<string>
  public readonly accessKeyId!: pulumi.Output<string>
  public readonly secretAccessKey!: pulumi.Output<string>

  constructor(name: string, args: any, opts?: pulumi.CustomResourceOptions) {
    const props = {
      accountId: null,
      accessKeyId: null,
      secretAccessKey: null,
    }

    super(new AwsFlavouredCredentialsProvider(), name, props, opts)
  }
}

export class AwsFlavouredCredentials extends pulumi.ComponentResource {
  public dynamicResource: AwsFlavouredCredentialsDynamicResource

  constructor(name: string, args: any, opts?: pulumi.ComponentResourceOptions) {
    super('vizv:resource:AwsFlavouredCredentials', name, {}, opts)

    this.dynamicResource = new AwsFlavouredCredentialsDynamicResource(
      name,
      {},
      {
        parent: this,
        protect: opts?.protect,
        dependsOn: opts?.dependsOn,
      },
    )
  }

  get accountId() {
    return this.dynamicResource.accountId
  }

  get accessKeyId() {
    return pulumi.secret(this.dynamicResource.accessKeyId)
  }

  get secretAccessKey() {
    return pulumi.secret(this.dynamicResource.secretAccessKey)
  }
}
