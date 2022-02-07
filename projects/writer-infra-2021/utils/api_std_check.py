def check_api_std_200(rsp_json):

    assert 'errno' in rsp_json
    assert 'message' in rsp_json
    assert 'data' in rsp_json
