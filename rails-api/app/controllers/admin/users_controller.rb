class Admin::UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]

  has_scope :by_query
  has_scope :by_role
  has_scope :by_sort, using: %i[column direction], type: :hash

  # GET /admin/users
  def index
    @users = authorize policy_scope(User)
    @users = apply_scopes(@users).paginate(page: params[:page])

    render json: @users,
           meta: pagination_dict(@users),
           adapter: :json,
           root: 'entries'
  end

  # GET /admin/users/1
  def show
    render json: @user
  end

  # POST /admin/users
  def create
    @user = authorize User.create!(user_params)

    render json: @user, status: :created
  end

  # PATCH/PUT /admin/users/1
  def update
    @user.update!(user_params)

    render json: @user
  end

  # DELETE /admin/users/1
  def destroy
    @user.destroy
  end

  private

  def set_user
    @user = policy_scope(User).find(params[:id])
    authorize @user
  end

  def user_params
    params.permit(
      :email,
      :password,
      :password_confirmation,
      :role,
      :first_name,
      :last_name
    )
  end
end
