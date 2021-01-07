class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :name, null: false
      t.integer :created_by, null: false

      t.timestamps
    end

    add_foreign_key :projects, :users, column: :created_by

    add_index :projects, :created_by
    add_index :projects, [:name, :created_by], :unique => true
  end
end
