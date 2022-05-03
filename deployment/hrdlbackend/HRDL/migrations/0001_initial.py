# Generated by Django 3.2.12 on 2022-03-06 12:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exchange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=255)),
                ('api_key', models.CharField(db_index=True, max_length=255)),
                ('api_secret', models.CharField(db_index=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PairModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lastTrained', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='TradingPair',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pairName', models.CharField(db_index=True, max_length=255, unique=True)),
                ('fullNamePair', models.CharField(max_length=255, unique=True)),
                ('modelPath', models.URLField(null=True)),
                ('lastTrained', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(db_index=True, max_length=255)),
                ('email', models.EmailField(blank=True, db_index=True, max_length=254, null=True, unique=True)),
                ('firstName', models.CharField(db_index=True, max_length=255)),
                ('lastName', models.CharField(db_index=True, max_length=255)),
                ('investmax', models.IntegerField(default=100)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TradingBot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=False)),
                ('status', models.IntegerField(default=0)),
                ('history', models.CharField(default='[]', max_length=255)),
                ('profit', models.IntegerField(default=0)),
                ('stopLoss', models.IntegerField(default=30)),
                ('takeProfit', models.IntegerField(default=30)),
                ('maxInvestPercentage', models.IntegerField(default=30)),
                ('playground', models.IntegerField(default=30)),
                ('exchange', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bots', to='HRDL.exchange')),
                ('pair', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bots', to='HRDL.tradingpair')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bots', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]