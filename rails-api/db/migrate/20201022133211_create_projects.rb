class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.integer :created_by

      t.timestamps
    end

    add_foreign_key :projects, :users, column: :created_by

    add_index :projects, :created_by
  end
end
