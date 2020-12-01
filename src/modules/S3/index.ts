import { gql, IResolvers } from "apollo-server"

const s3QueryTypeDefsfrom = gql`
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

  extend type Query {
    s3GetSignedPutObjectUrl(
      """
      my-little-bunny.jpg
      """
      fileName: String!
      """
      A standard MIME type describing thhe format of the object data.

      jpg, jpeg, png, etc.
      """
      fileType: String!
    ): S3Payload! @auth
  }
`

import * as s3QueryResolvers from "./Query"
export const s3Resolvers: IResolvers = {
  Query: {
    ...s3QueryResolvers,
  },
  Mutation: {},
}
export const s3TypeDefs = gql`
  ${s3QueryTypeDefsfrom}
`
