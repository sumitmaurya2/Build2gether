const admin = require("firebase-admin")

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }
  }

  return null
}

function initializeFirebaseAdmin() {
  if (admin.apps.length) {
    return admin.app()
  }

  const serviceAccount = getServiceAccount()
  if (serviceAccount) {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}

initializeFirebaseAdmin()

module.exports = admin
