import { ResolverFn } from "resolvers"
import { getUserId } from "utils"
import { User } from "entity/User"

type S3GetSignedPutObjectUrlArgs = {
  fileName: string
  fileType: "image/jpeg" | "image/png"
}
type S3GetSignedPutObjectUrlReturn = {
  signedPutObjectUrl
  objectUrl
}

/**
 * Get a signed s3 url to POST an image to S3
 */
export const s3GetSignedPutObjectUrl: ResolverFn<
  S3GetSignedPutObjectUrlReturn,
  S3GetSignedPutObjectUrlArgs
> = async function (parent, args, context, info) {
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")
  const { s3, connection } = context

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user.verified_date) {
    // Only provide signed url to verified users
    throw new Error("You must be verified to do that")
  }

  const { fileName, fileType } = args
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  }

  /**
   * const { file } = state // the file uploaded on the client
   * const options = {
   *   headers: {
   *     "Content-Type": file.type
   *   }
   * };
   * await axios.put(signedRequest, file, options);
   */
  const signedPutObjectUrl = s3.getSignedUrl("putObject", params)
  const objectUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`

  return {
    signedPutObjectUrl,
    objectUrl,
  }
}
