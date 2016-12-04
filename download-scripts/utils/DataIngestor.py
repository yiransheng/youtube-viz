#!/usr/bin/env python3
# inspired by Alejandro's class, made modifications for data transforms
# and gathering other metrics
# ideally would like to add selectivity of fields of interests
# as opposed to entire parts of the API response
import requests
import pandas as pd
import re

from pandas.io.json import json_normalize
from configparser import ConfigParser
from tqdm import tqdm


# Category Ids found from:
# https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key={API_KEY}
category_map = {1: "Film & Animation",
                2: "Autos & Vehicles",
                10: "Music",
                15: "Pets & Animals",
                17: "Sports",
                18: "Short Movies",
                19: "Travel & Events",
                20: "Gaming",
                21: "Videoblogging",
                22: "People & Blogs",
                23: "Comedy",
                24: "Entertainment",
                25: "News & Politics",
                26: "Howto & Style",
                27: "Education",
                28: "Science & Technology",
                29: "Nonprofits & Activism",
                30: "Movies",
                31: "Anime/Animation",
                32: "Action/Adventure",
                33: "Classics",
                34: "Comedy",
                35: "Documentary",
                36: "Drama",
                37: "Family",
                38: "Foreign",
                39: "Horror",
                40: "Sci-Fi/Fantasy",
                41: "Thriller",
                42: "Shorts",
                43: "Shows",
                44: "Trailers",
                }

def parse_duration(duration):
    try:
        minutes, seconds = [int(i) for i in re.split('[A-Z]', duration) if i != ""]
    except ValueError:
        # cases where only the minute level is presented
        minutes = [int(i) for i in re.split('[A-Z]', duration) if i != ""]
        minutes = minutes[0]        # unpack
        seconds = 0
    return (int(minutes) * 60) + int(seconds)

class DataIngestor():
    """Modify Alejandro's code for the use case that we just
     iterate on each video id and get desired data

    """
    def __init__(self, config_file, video_ids, sample=None):
        config = ConfigParser()
        config.read(config_file)
        yt_config = dict(config.items('YouTube'))
        self.api_key = yt_config['api_key']
        self.df = None
        self.video_ids = video_ids
        self.sample = sample

    def __build_row(self):
        data = None
        if self.response.json()['items']:
            data = self.response.json()['items'][0]
            return data

    def build_df(self):
        df_list = []
        counter = 0
        for vid in tqdm(self.video_ids[:self.sample]):
            try:
                row = self.__get_video_data(vid)
                counter += 1
                if row:
                    df_list.append(row)
            except:
                print("stopped at id {} and row {}".format(vid, counter))
                print("exporting successfully gathered data.")
                self.df = json_normalize(df_list)
                self.df['duration_sec'] = self.df['contentDetails.duration'].apply(parse_duration)
                self.df['category'] = self.df['snippet.categoryId'].apply(lambda x: category_map[int(x)])
                return self.df

        self.df = json_normalize(df_list)
        self.df['duration_sec'] = self.df['contentDetails.duration'].apply(parse_duration)
        self.df['category'] = self.df['snippet.categoryId'].apply(lambda x: category_map[int(x)])
        return self.df


    def __get_video_data(self, video_id):
        url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,\
                statistics,\
                snippet\
                &id={vid}&key={apikey}'.format(vid=video_id,
                                                                                                                                 apikey=self.api_key)
        self.response = requests.get(url)
        return self.__build_row()
