import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js"

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
  ClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ?? "",
}

if (!poolData.UserPoolId || !poolData.ClientId) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Cognito] NEXT_PUBLIC_COGNITO_USER_POOL_ID o NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID no están configurados.",
  )
}

const userPool = new CognitoUserPool(poolData)

export type SignUpParams = {
  email: string
  password: string
  attributes?: Record<string, string>
}

export async function signUpUser({ email, password, attributes = {} }: SignUpParams) {
  const attributeList: CognitoUserAttribute[] = Object.entries(attributes).map(
    ([Name, Value]) => new CognitoUserAttribute({ Name, Value }),
  )

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

export async function signInUser(email: string, password: string) {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  })

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  })

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve(session)
      },
      onFailure: (err) => {
        reject(err)
      },
    })
  })
}

export async function confirmSignUp(email: string, code: string) {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  })

  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

export type CognitoUserProfile = {
  email: string
  name?: string
  birthdate?: string
}

export async function getCurrentUserProfile(): Promise<CognitoUserProfile | null> {
  const user = userPool.getCurrentUser()
  if (!user) return null

  return new Promise((resolve, reject) => {
    user.getSession((err) => {
      if (err) {
        reject(err)
        return
      }

      user.getUserAttributes((attrErr, attributes) => {
        if (attrErr) {
          reject(attrErr)
          return
        }

        const result: CognitoUserProfile = { email: "" }
        attributes?.forEach((attr) => {
          if (attr.getName() === "email") {
            result.email = attr.getValue()
          }
          if (attr.getName() === "name") {
            result.name = attr.getValue()
          }
          if (attr.getName() === "birthdate") {
            result.birthdate = attr.getValue()
          }
        })

        resolve(result)
      })
    })
  })
}

export async function updateCurrentUserAttributes(attributes: Record<string, string>) {
  const user = userPool.getCurrentUser()
  if (!user) {
    throw new Error("No authenticated user.")
  }

  const attributeList: CognitoUserAttribute[] = Object.entries(attributes).map(
    ([Name, Value]) => new CognitoUserAttribute({ Name, Value }),
  )

  return new Promise((resolve, reject) => {
    user.getSession((err) => {
      if (err) {
        reject(err)
        return
      }

      user.updateAttributes(attributeList, (updateErr, result) => {
        if (updateErr) {
          reject(updateErr)
          return
        }
        resolve(result)
      })
    })
  })
}

export function signOutUser() {
  const user = userPool.getCurrentUser()
  if (user) {
    user.signOut()
  }
}



