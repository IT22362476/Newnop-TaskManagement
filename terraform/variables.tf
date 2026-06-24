/**
 * Terraform Variables
 */
variable "app_name" {
  description = "Base name for the application (used in resource naming)"
  type        = string
  default     = "newtaskmgmt"
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "rg-taskmanagement"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Southeast Asia"
}

variable "app_service_sku" {
  description = "SKU for the App Service Plan (e.g., F1 Free, B1 Basic, S1 Standard)"
  type        = string
  default     = "B1"
}

variable "static_web_app_sku_tier" {
  description = "SKU tier for the Static Web App (Free or Standard)"
  type        = string
  default     = "Free"
}

variable "static_web_app_sku_size" {
  description = "SKU size for the Static Web App"
  type        = string
  default     = "Free"
}

variable "mongodb_uri" {
  description = "MongoDB connection string (e.g., from MongoDB Atlas)"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret key for JWT signing"
  type        = string
  sensitive   = true
}

variable "admin_secret" {
  description = "Secret code for registering admin users"
  type        = string
  sensitive   = true
  default     = "admin_secret_change_me"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "production"
    Project     = "TaskManagement"
    ManagedBy   = "Terraform"
  }
}
