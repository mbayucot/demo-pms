class CsvChannel < ApplicationCable::Channel
  def subscribed
    reject unless params[:uuid].present?
    stream_from "csv_channel_#{params[:uuid]}"
  end

  def unsubscribed; end
end
