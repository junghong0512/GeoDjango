# Generated by Django 3.2.4 on 2021-06-21 09:01

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reporter', '0003_alter_incidences_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='Gangnam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pnu', models.CharField(max_length=19)),
                ('jibun', models.CharField(max_length=15)),
                ('bchk', models.CharField(max_length=1)),
                ('sgg_oid', models.BigIntegerField()),
                ('col_adm_se', models.CharField(max_length=5)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
    ]
