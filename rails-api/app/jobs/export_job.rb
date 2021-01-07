class ExportJob < ApplicationJob
  queue_as :default

  def perform(export)
    uuid = export.uuid
    begin
      klass = export.klass.constantize
      csv_content = klass.to_csv(export.sql)
      ActionCable.server.broadcast(
        "csv_channel_#{uuid}",
        status: 200,
        data: { file_name: "#{klass}.csv", content: csv_content }
      )
    rescue StandardError => e
      ActionCable.server.broadcast(
        "csv_channel_#{uuid}",
        status: 422, error: e.message
      )
    end
  end
end
