import json
import csv
import codecs
import hashlib

input_file = '/Users/jackon/projects-in-one/datasets/hero-sanguo/hero-teams-s1-merged.csv'


def iter_csv_line(csv_fname):
    with codecs.open(csv_fname, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            yield row


def iter_team_record(csv_fname):
    infos = []

    for items in iter_csv_line(csv_fname):
        cleansed_items = [i.strip() for i in items if i.strip()]
        if len(cleansed_items) > 0:
            infos.append(cleansed_items)
        else:
            assert len(infos) == 4, "info len: %s" % len(infos)
            yield infos
            infos = []

    if len(infos):
        assert len(infos) == 4, "info len: %s" % len(infos)
        return infos


def md5_for_text(text, hr=True):
    md5 = hashlib.md5()
    md5.update(text.encode('utf8'))
    if hr:
        return md5.hexdigest()
    return md5.digest()


def record2josn(r):
    team_info, hero_0, hero_1, hero_2 = r
    team_name = team_info[0]
    team_score = team_info[1]

    hero_0_team_pos, hero_0_name, hero_0_skill1, hero_0_skill2, notes = hero_0
    hero_1_team_pos, hero_1_name, hero_1_skill1, hero_1_skill2 = hero_1
    hero_2_team_pos, hero_2_name, hero_2_skill1, hero_2_skill2 = hero_2

    return {
        'tid': md5_for_text(team_name),
        'team_name': team_name,
        'team_score': team_score,
        'notes': notes,
        'heros': [
            {
                'team_pos': hero_0_team_pos,
                'name': hero_0_name,
                'skill1': hero_0_skill1,
                'skill2': hero_0_skill2,
            },
            {
                'team_pos': hero_1_team_pos,
                'name': hero_1_name,
                'skill1': hero_1_skill1,
                'skill2': hero_1_skill2,
            },
            {
                'team_pos': hero_2_team_pos,
                'name': hero_2_name,
                'skill1': hero_2_skill1,
                'skill2': hero_2_skill2,
            },
        ]
    }


def main():
    teams = []
    for r in iter_team_record(input_file):
        json_r = record2josn(r)
        teams.append(json_r)

    with codecs.open('teams.json', 'w', encoding='utf8') as fw:
        for i in teams:
            fw.write(json.dumps(i, ensure_ascii=False))
            fw.write('\n')
    print(len(teams))


if __name__ == "__main__":
    main()
