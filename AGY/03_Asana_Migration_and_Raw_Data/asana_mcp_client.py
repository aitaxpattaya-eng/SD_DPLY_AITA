
import json
import os
import sys
from solvemcp import MCPClient
from fastcore.basics import AttrDict # Import AttrDict

asana_access_token = "2/1150781987373301/1212509259931498:***"

env = os.environ.copy()
env["ASANA_ACCESS_TOKEN"] = asana_access_token

def to_json_compatible(obj):
    if isinstance(obj, AttrDict):
        return {k: to_json_compatible(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [to_json_compatible(elem) for elem in obj]
    elif isinstance(obj, dict):
        return {k: to_json_compatible(v) for k, v in obj.items()}
    # Add a check for other types that might be problematic
    elif hasattr(obj, '__dict__'): # If it's a custom object with a dict
        print(f"[DEBUG] Found unhandled object type with __dict__: {type(obj)}")
        return to_json_compatible(obj.__dict__)
    elif hasattr(obj, '__slots__'): # If it's a custom object with slots
        print(f"[DEBUG] Found unhandled object type with __slots__: {type(obj)}")
        return {s: to_json_compatible(getattr(obj, s)) for s in obj.__slots__}
    else:
        # If it's still not serializable, print its type to identify the culprit
        print(f"[DEBUG] Unhandled object type: {type(obj)} - Value: {obj}")
        return obj

def main():
    print("[CLIENT] Starting MCP client...")
    try:
        with MCPClient.stdio(["mcp-server-asana"], env=env) as mcp:
            print("[CLIENT] Connected to MCP server.")

            if hasattr(mcp, 'asana_list_workspaces'):
                print("[CLIENT] Found asana_list_workspaces tool. Attempting to list workspaces...")
                workspaces_result_obj = mcp.asana_list_workspaces()
                workspaces_result = to_json_compatible(workspaces_result_obj)
                print(f"[CLIENT] Workspaces: {json.dumps(workspaces_result, indent=2)}")
            else:
                print("[CLIENT] asana_list_workspaces tool not found directly. Listing all tools...")
                tools_list_raw = mcp.rpc('tools/list', {})
                tools = tools_list_raw.get('tools', [])
                print("[CLIENT] Available tools (from rpc call):")
                for tool in tools:
                    print(f"  - {tool['name']}")

                if any(t['name'] == 'asana_list_workspaces' for t in tools):
                    print("[CLIENT] asana_list_workspaces found in RPC list. Calling via rpc...")
                    workspaces_result_obj = mcp.rpc('tools/call', dict(name='asana_list_workspaces', arguments={}))
                    workspaces_result = to_json_compatible(workspaces_result_obj)
                    print(f"[CLIENT] Workspaces (from rpc call): {json.dumps(workspaces_result, indent=2)}")
                else:
                    print("[CLIENT] asana_list_workspaces not found even via rpc/tools/list.")

    except Exception as e:
        print(f"[CLIENT] An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
