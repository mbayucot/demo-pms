class ImportJob < ApplicationJob
  queue_as :default

  def perform(document)
    uuid = document.uuid
    begin
      document.file.open { |file| document.klass.constantize.import(file.path, document.params) }
      ActionCable.server.broadcast("csv_channel_#{uuid}", status: 200)
    rescue StandardError => e
      ActionCable.server.broadcast(
        "csv_channel_#{uuid}",
        status: 422, error: e.message
      )
    end
  end
end
