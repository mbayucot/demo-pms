class ApplicationController < ActionController::API
  include ExceptionHandler
  include Pundit

  before_action :authenticate_user!

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def pagination_dict(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_entries
    }
  end

  def user_not_authorized
    render json: { error: 'You cannot perform this action.' },
           status: :forbidden
  end
end
