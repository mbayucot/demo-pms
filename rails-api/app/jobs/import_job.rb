class ImportJob < ApplicationJob
  queue_as :default

  rescue_from(Exceptions::MissingRequirement) do |exception|
    ActionCable.server.broadcast(
      "csv_channel_#{document.uuid}",
      status: 422, error: exception.message
    )
  end

  rescue_from(ActiveRecord::RecordInvalid) do |exception|
    ActionCable.server.broadcast(
      "csv_channel_#{document.uuid}",
      status: 422, error: exception.message
    )
  end

  def perform(document)
    document.file.open { |file| document.klass.constantize.import(file.path) }

    ActionCable.server.broadcast("csv_channel_#{document.uuid}", status: 200)
  end
end
