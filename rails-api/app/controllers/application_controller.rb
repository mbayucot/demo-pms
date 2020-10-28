class ApplicationController < ActionController::API
  include ExceptionHandler
  include Pageable

  before_action :authenticate_user!
end
