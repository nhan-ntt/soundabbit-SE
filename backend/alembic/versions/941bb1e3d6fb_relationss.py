"""relationss

Revision ID: 941bb1e3d6fb
Revises: 878c21671663
Create Date: 2024-05-11 17:38:45.535213

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '941bb1e3d6fb'
down_revision: Union[str, None] = '878c21671663'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('playlist_song',
    sa.Column('playlist_id', sa.Integer(), nullable=True),
    sa.Column('song_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['playlist_id'], ['playlists.id'], ),
    sa.ForeignKeyConstraint(['song_id'], ['songs.id'], )
    )
    op.create_table('user_song',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('song_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['song_id'], ['songs.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], )
    )
    op.add_column('songs', sa.Column('artist_id', sa.Integer(), nullable=False))
    op.add_column('songs', sa.Column('genre_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'songs', 'genres', ['genre_id'], ['id'])
    op.create_foreign_key(None, 'songs', 'artists', ['artist_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'songs', type_='foreignkey')
    op.drop_constraint(None, 'songs', type_='foreignkey')
    op.drop_column('songs', 'genre_id')
    op.drop_column('songs', 'artist_id')
    op.drop_table('user_song')
    op.drop_table('playlist_song')
    # ### end Alembic commands ###