/**
 * Terraform configuration for provisioning Azure resources.
 *
 * Prerequisites:
 *   - Azure CLI logged in (az login)
 *   - Terraform installed (>= 1.5)
 *
 * Usage:
 *   terraform init
 *   terraform plan -var="app_name=my-taskmanager" -var="resource_group_name=rg-taskmanager"
 *   terraform apply
 */

terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azurerm" {
  features {}
}

# Random suffix for globally unique names
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# -------------------- Resource Group --------------------
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# -------------------- App Service Plan --------------------
resource "azurerm_service_plan" "main" {
  name                = "${var.app_name}-plan-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = var.app_service_sku
  tags                = var.tags
}

# -------------------- App Service (Backend) --------------------
resource "azurerm_linux_web_app" "backend" {
  name                = "${var.app_name}-api-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true

  site_config {
    application_stack {
      node_version = "20-lts"
    }
    always_on     = var.app_service_sku != "F1" ? true : false
    ftps_state    = "Disabled"
  }

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "20-lts"
    NODE_ENV                     = "production"
    PORT                         = "8080"
    MONGODB_URI                  = var.mongodb_uri
    JWT_SECRET                   = var.jwt_secret
    SCM_DO_BUILD_DURING_DEPLOYMENT = "false"
  }

  tags = var.tags
}

# -------------------- Static Web App (Frontend) --------------------
resource "azurerm_static_web_app" "frontend" {
  name                = "${var.app_name}-web-${random_string.suffix.result}"
  location            = "eastasia"
  resource_group_name = azurerm_resource_group.main.name
  sku_tier            = var.static_web_app_sku_tier
  sku_size            = var.static_web_app_sku_size

  app_settings = {
    API_URL = "https://${azurerm_linux_web_app.backend.default_hostname}"
  }

  tags = var.tags
}
