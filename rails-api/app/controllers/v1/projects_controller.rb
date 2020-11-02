class V1::ProjectsController < ApplicationController
  include ActionController::MimeResponds

  before_action :set_project, only: %i[show update destroy]

  has_scope :by_query
  has_scope :by_sort, using: %i[column direction], type: :hash

  # GET /v1/projects
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
          export = Export.new(params[:uuid], Project.to_s, @projects.to_sql)
          ExportJob.perform_later(export)
          head :accepted
        else
          head :bad_request
        end
      end
    end
  end

  # GET /v1/projects/1
  def show
    render json: @project
  end

  # POST /v1/projects
  def create
    @project = authorize current_user.projects.create!(project_params)

    render json: @project, status: :created
  end

  # PATCH/PUT /v1/projects/1
  def update
    @project.update!(project_params)

    render json: @project
  end

  # DELETE /v1/projects/1
  def destroy
    @project.destroy
  end

  # POST /v1/projects/import
  def import
    @user = current_user
    @import =
      authorize @user.imports.create!(import_params.merge(klass: Project.to_s))

    render json: @import, status: :created
  end

  private

  def set_project
    @project = policy_scope(Project).find(params[:id])
    authorize @project
  end

  def project_params
    params.fetch(:project, {}).permit(:name)
  end

  def import_params
    params.permit(:uuid, :file)
  end
end
