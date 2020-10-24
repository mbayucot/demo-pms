class Admin::ProjectsController < ApplicationController
  before_action :set_project, only: %i[show update destroy]

  # GET /admin/projects
  def index
    @projects = policy_scope(Project).paginate(page: params[:page])

    render json: @projects,
           meta: pagination_dict(@projects),
           adapter: :json,
           root: 'entries'
  end

  # GET /admin/projects/1
  def show
    render json: @project
  end

  # PATCH/PUT /admin/projects/1
  def update
    @project.update!(project_params)

    render json: @project
  end

  # DELETE /admin/projects/1
  def destroy
    @project.destroy
  end

  private

  def set_project
    @project = policy_scope(Project).find(params[:id])
    authorize @project
  end

  # Only allow a trusted parameter "white list" through.
  def project_params
    params.fetch(:project, {}).permit(:name)
  end
end
