const mongoose = require("mongoose")

function assertSafeObject(value, path = "body") {
  if (!value || typeof value !== "object") {
    return
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (key.startsWith("$") || key.includes(".")) {
      const error = new Error(`Invalid field name in ${path}`)
      error.status = 400
      throw error
    }

    if (Array.isArray(nestedValue)) {
      nestedValue.forEach((item, index) => {
        if (item && typeof item === "object") {
          assertSafeObject(item, `${path}.${key}[${index}]`)
        }
      })
    } else if (nestedValue && typeof nestedValue === "object") {
      assertSafeObject(nestedValue, `${path}.${key}`)
    }
  }
}

function pickAllowed(source, allowedFields) {
  assertSafeObject(source)

  return allowedFields.reduce((picked, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      picked[field] = source[field]
    }
    return picked
  }, {})
}

function cleanString(value, maxLength) {
  if (value == null) {
    return ""
  }

  if (typeof value !== "string") {
    return ""
  }

  return value.trim().slice(0, maxLength)
}

function cleanStringArray(value, maxItems, maxLength) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => cleanString(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems)
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function parsePositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  return Math.min(parsed, max)
}

function validateObjectId(value, label = "id") {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`)
    error.status = 400
    throw error
  }
}

function getConversationKey(userIdA, userIdB) {
  return [userIdA.toString(), userIdB.toString()].sort().join("_")
}

module.exports = {
  assertSafeObject,
  cleanString,
  cleanStringArray,
  escapeRegex,
  getConversationKey,
  parsePositiveInt,
  pickAllowed,
  validateObjectId,
}
