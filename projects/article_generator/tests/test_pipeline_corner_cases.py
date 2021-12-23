from article_generator.pipelines.image_group_pipe import tag_image


def test_image_out_of_range():
    # make sure no exception
    tag_image('anything', 1)
    tag_image('dudu-1', 100)
