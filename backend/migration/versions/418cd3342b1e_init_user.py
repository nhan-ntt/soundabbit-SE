"""init user

Revision ID: 418cd3342b1e
Revises: 0b31552be6bb
Create Date: 2024-04-22 17:50:59.419633

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '418cd3342b1e'
down_revision: Union[str, None] = '0b31552be6bb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
