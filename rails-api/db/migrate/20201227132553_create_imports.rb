class CreateImports < ActiveRecord::Migration[6.0]
  def change
    create_table :imports do |t|
      t.string :klass, null: false
      t.string :uuid, null: false
      t.references :user, null: false, foreign_key: true
      t.string :params

      t.timestamps
    end
  end
end
