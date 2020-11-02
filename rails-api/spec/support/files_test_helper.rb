module FilesTestHelper
  extend self
  extend ActionDispatch::TestProcess

  def png_name
    'test.png'
  end

  def png
    upload(png_name, 'image/png')
  end

  def jpg_name
    'test.jpg'
  end

  def jpg
    upload(jpg_name, 'image/jpg')
  end

  def pdf_name
    'test.pdf'
  end

  def pdf
    upload(pdf_name, 'application/pdf')
  end

  def csv_name
    'test.csv'
  end

  def csv
    upload(csv_name, 'text/csv')
  end

  def projects_csv_name
    'projects.csv'
  end

  def projects_csv
    upload(projects_csv_name, 'text/csv')
  end

  private

  def upload(name, type)
    file_path = Rails.root.join('spec', 'support', 'assets', name)
    fixture_file_upload(file_path, type)
  end
end
