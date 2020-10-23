class ApplicationController < ActionController::API
  include ExceptionHandler

  before_action :authenticate_user!

  private

  def pagination_dict(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_entries
    }
  end
end
