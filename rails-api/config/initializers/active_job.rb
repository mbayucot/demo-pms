require 'export_serializer'

Rails.application.config.active_job.queue_adapter = :sidekiq
Rails.application.config.active_job.custom_serializers << ExportSerializer
