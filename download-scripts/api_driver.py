import pandas as pd
import csv
import argparse
import sys
import json

from utils.DataIngestor import DataIngestor
from tqdm import tqdm


def main(video_ids, configfile, outfile):
    video_ids = [i.strip() for i in list(video_ids)]
    d = DataIngestor(configfile, video_ids)

    d.build_df().to_json(outfile, orient='records')
    print("Done")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="run a list of youtube ids through API to get values")
    parser.add_argument("--input", type=argparse.FileType('r'), help="input file of video id's")
    parser.add_argument("--output", type=str, help="output file")
    parser.add_argument("--config", nargs=1, type=str, help="file location of config", default="config/config.ini")

    args = parser.parse_args()

    main(args.input if args.input else sys.stdin, args.config, args.output if args.output else sys.stdout)