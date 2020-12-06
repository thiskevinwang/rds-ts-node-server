import { gql, IResolvers } from "apollo-server"

const s3MutationTypeDefs = gql`
  type S3Payload {
    """
    #### Example
    https://<bucket-name>.s3.amazonaws.com/<somefile.png>

    ?AWSAccessKeyId=...

    &Content-Type=jpg

    &Expires=1576639181

    &Signature=somehash

    &x-amz-acl=public-read
    """
    signedPutObjectUrl: String!
    """
    #### Example
    https://<bucket-name>.s3.amazonaws.com/<somefile.png>
    """
    objectUrl: String!
  }

  extend type Mutation {
    s3GetSignedPutObjectUrl(
      """
      some-user-id/avatar.jpg
      """
      fileName: String!
      """
      A standard MIME type describing the format of the object data.

      jpg, jpeg, png, etc.
      """
      fileType: String!
    ): S3Payload! @auth
  }
`

import * as s3MutationResolvers from "./Mutation"
export const s3Resolvers: IResolvers = {
  Query: {},
  Mutation: {
    ...s3MutationResolvers,
  },
}
export const s3TypeDefs = gql`
  ${s3MutationTypeDefs}
`
