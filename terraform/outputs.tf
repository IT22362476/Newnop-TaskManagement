/**
 * Terraform Outputs
 * Displayed after `terraform apply` completes.
 */
output "backend_url" {
  description = "The URL of the deployed backend API"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  description = "The URL of the deployed frontend (Static Web App)"
  value       = azurerm_static_web_app.frontend.default_host_name
}

output "acr_login_server" {
  description = "Azure Container Registry login server"
  value       = azurerm_container_registry.main.login_server
}

output "acr_admin_username" {
  description = "ACR admin username (for GitHub Actions)"
  value       = azurerm_container_registry.main.admin_username
}

output "resource_group_name" {
  description = "The name of the created Resource Group"
  value       = azurerm_resource_group.main.name
}
