#!/usr/bin/env python3
# originally from Alejandro
# https://github.com/venamax/yt8m/blob/master/YT8M.ipynb
import zipfile
import sys
import csv
import pandas as pd

from csv import reader

csv.field_size_limit(sys.maxsize)

class DataSampleGenerator():
    def __init__(self,myzipfile, rand_var, frac):
        self.myzip = zipfile.ZipFile(myzipfile, 'r')
        self.rand_var = rand_var
        self.frac = frac

    def transform(self, filename):
        myfile = filename
        with self.myzip.open(myfile) as f:
            df = pd.read_csv(f)
            df = df.sample(frac=self.frac, random_state=self.rand_var)
            return df