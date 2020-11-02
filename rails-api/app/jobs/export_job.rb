class ExportJob < ApplicationJob
  queue_as :default

  rescue_from(Exceptions::MissingRequirement) do |exception|
    ActionCable.server.broadcast(
      "csv_channel_#{export.uuid}",
      status: 422, error: exception.message
    )
  end

  def perform(export)
    klass = export.klass.constantize
    uuid = export.uuid
    csv_content = klass.find_by_sql(export.sql).to_csv

    ActionCable.server.broadcast(
      "csv_channel_#{uuid}",
      status: 200,
      data: { file_name: "#{klass}-#{uuid}.csv", content: csv_content }
    )
  end
end
