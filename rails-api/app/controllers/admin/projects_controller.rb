class Admin::ProjectsController < ApplicationController
  include ActionController::MimeResponds
  before_action :set_project, only: %i[show update destroy]

  has_scope :by_query
  has_scope :by_created_by
  has_scope :by_sort, using: %i[column direction], type: :hash

  # GET /admin/projects
  def index
    @projects = authorize policy_scope(Project)
    @projects = apply_scopes(@projects)

    respond_to do |format|
      @projects = @projects.paginate(page: params[:page])

      format.json do
        render json: @projects,
               meta: pagination_dict(@projects),
               adapter: :json,
               root: 'entries'
      end
      format.csv do
        if params[:uuid].present?
          export = Export.new(params[:uuid], Project.to_s, @projects.select(:name).to_sql)
          ExportJob.perform_later(export)
          head :accepted
        else
          head :bad_request
        end
      end
    end
  end

  # GET /admin/projects/1
  def show
    render json: @project
  end

  # POST /admin/v1/projects
  def create
    @project = authorize Project.create!(project_params)

    render json: @project, status: :created
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

  def project_params
    params.fetch(:project, {}).permit(:name, :created_by)
  end

  def import_params
    params.permit(:uuid, :file)
  end
end
